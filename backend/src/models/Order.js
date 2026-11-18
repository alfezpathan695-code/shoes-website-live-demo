const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  unitPrice: { type: Number, required: true, min: 0 },
  variant: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true },
  addressLine: { type: String, required: true, trim: true, maxlength: 240 },
  city: { type: String, required: true, trim: true, maxlength: 80 },
  state: { type: String, required: true, trim: true, maxlength: 80 },
  pincode: { type: String, required: true, trim: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true, validate: [(items) => items.length > 0, 'Order must include an item'] },
  shippingAddress: { type: addressSchema, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
