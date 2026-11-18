const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/HttpError');
const getProductOptions = require('../utils/productOptions');
const serializeProduct = require('../utils/productSerializer');

const sortFields = {
  'price-low': { price: 1 },
  'price-high': { price: -1 },
  rating: { rating: -1, reviews: -1 },
  recommended: { productId: 1 },
};

const listProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 200);
  const filter = {};

  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) {
    const escapedQuery = req.query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: escapedQuery, $options: 'i' };
  }

  const [records, total] = await Promise.all([
    Product.find(filter)
      .sort(sortFields[req.query.sort || 'recommended'])
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    products: records.map(serializeProduct),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ productId: Number(req.params.id) }).lean();
  if (!product) throw new HttpError(404, 'Product not found.');
  res.json({ product: serializeProduct(product) });
});

const createProduct = asyncHandler(async (req, res) => {
  const productOptions = getProductOptions(req.body);
  const product = await Product.create({
    ...req.body,
    ...(req.body.variants === undefined ? productOptions : {}),
  });
  res.status(201).json({ product: serializeProduct(product.toObject()) });
});

const updateProduct = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'category', 'price', 'oldPrice', 'rating', 'reviews', 'badge', 'image', 'color', 'variantLabel', 'variants'];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([field]) => allowedFields.includes(field)),
  );
  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, 'Provide at least one product field to update.');
  }

  const product = await Product.findOneAndUpdate(
    { productId: Number(req.params.id) },
    updates,
    { new: true, runValidators: true },
  ).lean();
  if (!product) throw new HttpError(404, 'Product not found.');
  res.json({ product: serializeProduct(product) });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ productId: Number(req.params.id) });
  if (!product) throw new HttpError(404, 'Product not found.');
  res.json({ message: 'Product deleted.' });
});

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
