import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 8000,
});

export async function fetchProducts() {
  const { data } = await api.get('/products', { params: { limit: 200 } });
  if (!Array.isArray(data.products)) {
    throw new Error('The catalog API returned an invalid response.');
  }
  if (data.products.length === 0) {
    throw new Error('The catalog is empty. Seed the database to load live products.');
  }
  return data.products;
}

export async function signIn(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  return data;
}

export async function createAccount(details) {
  const { data } = await api.post('/auth/register', details);
  return data;
}

export async function submitOrder(order, token) {
  const { data } = await api.post('/orders', order, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
