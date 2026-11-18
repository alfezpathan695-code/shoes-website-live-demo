const app = require('../src/app');
const jwt = require('jsonwebtoken');
const Order = require('../src/models/Order');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const originalJwtSecret = process.env.JWT_SECRET;

let server;
let apiUrl;

beforeAll(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  apiUrl = `http://127.0.0.1:${server.address().port}/api`;
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
});

test('health endpoint reports API and database state', async () => {
  const response = await fetch(`${apiUrl}/health`);
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.status).toBe('ok');
  expect(body).toHaveProperty('database');
});

test('product filters reject an unsupported category', async () => {
  const response = await fetch(`${apiUrl}/products?category=not-a-category`);
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.message).toMatch(/check the request details/i);
});

test('product listing serializes database ids to storefront ids', async () => {
  const record = {
    _id: 'product-record-1',
    productId: 7,
    name: 'Cotton kurta',
    category: 'Women',
    price: 250,
    oldPrice: 400,
    rating: 4.5,
    reviews: 20,
    badge: '',
    image: 'photo-test',
    color: '#ffffff',
    variantLabel: 'Size',
    variants: ['S', 'M'],
  };
  const query = {
    sort: jest.fn(() => query),
    skip: jest.fn(() => query),
    limit: jest.fn(() => query),
    lean: jest.fn().mockResolvedValue([record]),
  };
  jest.spyOn(Product, 'find').mockReturnValue(query);
  jest.spyOn(Product, 'countDocuments').mockResolvedValue(1);

  const response = await fetch(`${apiUrl}/products?category=Women&sort=price-low`);
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.products[0].id).toBe(7);
  expect(body.products[0]).not.toHaveProperty('_id');
  expect(body.products[0]).not.toHaveProperty('productId');
  expect(body.products[0].variants).toEqual(['S', 'M']);
  expect(Product.find).toHaveBeenCalledWith({ category: 'Women' });
});

test('registration rejects invalid input before database access', async () => {
  const response = await fetch(`${apiUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'A', email: 'not-an-email', password: 'short' }),
  });
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.errors.length).toBeGreaterThan(0);
});

test('orders require a bearer token', async () => {
  const response = await fetch(`${apiUrl}/orders/my-orders`);
  const body = await response.json();

  expect(response.status).toBe(401);
  expect(body.message).toMatch(/sign in/i);
});

test('order creation uses database prices and the selected variant', async () => {
  const secret = 'test-secret-that-is-long-enough-for-jwt-signing';
  process.env.JWT_SECRET = secret;
  jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'customer-1', role: 'customer' });
  jest.spyOn(Product, 'find').mockReturnValue({
    lean: async () => [{
      _id: 'product-record-1',
      productId: 7,
      name: 'Cotton kurta',
      category: 'Women',
      image: 'photo-test',
      price: 250,
      variants: ['S', 'M', 'L'],
    }],
  });
  jest.spyOn(Order, 'create').mockImplementation(async (order) => ({
    _id: 'order-1',
    ...order,
    status: 'placed',
    paymentStatus: 'pending',
  }));
  const token = jwt.sign({ sub: 'customer-1' }, secret);

  const response = await fetch(`${apiUrl}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ productId: 7, variant: 'M', quantity: 2 }],
      shippingAddress: {
        fullName: 'Test Customer',
        phone: '9876543210',
        addressLine: '12 Market Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
      },
    }),
  });
  const body = await response.json();

  expect(response.status).toBe(201);
  expect(body.order.total).toBe(500);
  expect(body.order.items[0].unitPrice).toBe(250);
  expect(body.order.items[0].variant).toBe('M');
  expect(body.order.paymentStatus).toBe('pending');
});

test('order creation rejects a size that the product does not offer', async () => {
  const secret = 'test-secret-that-is-long-enough-for-jwt-signing';
  process.env.JWT_SECRET = secret;
  jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'customer-1', role: 'customer' });
  jest.spyOn(Product, 'find').mockReturnValue({
    lean: async () => [{
      _id: 'product-record-1',
      productId: 7,
      name: 'Cotton kurta',
      category: 'Women',
      image: 'photo-test',
      price: 250,
      variants: ['S', 'M', 'L'],
    }],
  });
  const createOrder = jest.spyOn(Order, 'create');
  const token = jwt.sign({ sub: 'customer-1' }, secret);

  const response = await fetch(`${apiUrl}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ productId: 7, variant: 'XXL', quantity: 1 }],
      shippingAddress: {
        fullName: 'Test Customer',
        phone: '9876543210',
        addressLine: '12 Market Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
      },
    }),
  });

  expect(response.status).toBe(400);
  expect(createOrder).not.toHaveBeenCalled();
});
