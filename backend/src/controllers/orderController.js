const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/HttpError');
const getProductOptions = require('../utils/productOptions');

const createOrder = asyncHandler(async (req, res) => {
  const productIds = [...new Set(req.body.items.map((item) => Number(item.productId)))];
  const products = await Product.find({ productId: { $in: productIds } }).lean();
  const productsById = new Map(products.map((product) => [product.productId, product]));

  const items = req.body.items.map((requestedItem) => {
    const product = productsById.get(Number(requestedItem.productId));
    if (!product) throw new HttpError(400, `Product ${requestedItem.productId} is no longer available.`);

    const variant = requestedItem.variant || 'Standard';
    const variants = product.variants?.length
      ? product.variants
      : getProductOptions(product).variants;
    if (variants.length && !variants.includes(variant)) {
      throw new HttpError(400, `Choose a valid size for ${product.name}.`);
    }
    if (!variants.length && variant !== 'Standard') {
      throw new HttpError(400, `${product.name} does not have size options.`);
    }

    return {
      product: product._id,
      productId: product.productId,
      name: product.name,
      category: product.category,
      image: product.image,
      unitPrice: product.price,
      variant,
      quantity: Number(requestedItem.quantity),
    };
  });

  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress: req.body.shippingAddress,
    subtotal,
    total: subtotal,
  });

  res.status(201).json({ order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ orders });
});

const getOrder = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(404, 'Order not found.');
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!order) throw new HttpError(404, 'Order not found.');
  res.json({ order });
});

module.exports = { createOrder, getMyOrders, getOrder };
