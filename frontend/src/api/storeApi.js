import axios from 'axios';

const LOCAL_ACCOUNTS_KEY = 'mela-local-accounts';
const LOCAL_ORDERS_KEY = 'mela-local-orders';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://mela-marketplace-api.onrender.com/api',
  timeout: 8000,
});

function isNetworkError(error) {
  return error.code === 'ERR_NETWORK'
    || error.code === 'ECONNABORTED'
    || !error.response;
}

function readLocalAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '[]');
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function saveLocalAccounts(accounts) {
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return password;
}

function createLocalSession(account) {
  return {
    token: `local-${account.id}`,
    user: { id: account.id, name: account.name, email: account.email, role: 'customer' },
  };
}

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
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  } catch (error) {
    if (!isNetworkError(error)) throw error;

    const email = credentials.email.trim().toLowerCase();
    const account = readLocalAccounts().find((item) => item.email === email);
    if (!account || account.passwordHash !== await hashPassword(credentials.password)) {
      throw new Error('Email or password is incorrect.');
    }
    return createLocalSession(account);
  }
}

export async function createAccount(details) {
  try {
    const { data } = await api.post('/auth/register', details);
    return data;
  } catch (error) {
    if (!isNetworkError(error)) throw error;

    const email = details.email.trim().toLowerCase();
    const accounts = readLocalAccounts();
    if (accounts.some((account) => account.email === email)) {
      throw new Error('A local account already exists with this email.');
    }

    const account = {
      id: `local-${Date.now()}`,
      name: details.name.trim(),
      email,
      passwordHash: await hashPassword(details.password),
    };
    saveLocalAccounts([...accounts, account]);
    return createLocalSession(account);
  }
}

export async function submitOrder(order, token) {
  try {
    const { data } = await api.post('/orders', order, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (!isNetworkError(error)) throw error;

    const subtotal = order.items.reduce(
      (total, item) => total + Number(item.unitPrice || 0) * Number(item.quantity || 0),
      0,
    );
    const localOrder = {
      _id: `local-${Date.now()}`,
      items: order.items,
      shippingAddress: order.shippingAddress,
      subtotal,
      total: subtotal,
      status: 'placed',
      paymentStatus: 'pending',
      localOnly: true,
    };
    const previousOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(
      Array.isArray(previousOrders) ? [localOrder, ...previousOrders] : [localOrder],
    ));
    return { order: localOrder };
  }
}
