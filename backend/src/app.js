const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'Mela Marketplace API' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
