const mongoose = require('mongoose');

const categories = [
  'Women',
  'Men',
  'Girls',
  'Boys',
  'Kids',
  'Home',
  'Beauty',
  'Accessories',
  'Electronics',
  'Kitchen',
  'Shoes',
];

const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true, min: 1 },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  category: { type: String, required: true, enum: categories },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviews: { type: Number, required: true, min: 0 },
  badge: { type: String, default: '', maxlength: 40 },
  image: { type: String, required: true, trim: true },
  color: { type: String, required: true, match: /^#[0-9a-f]{6}$/i },
  variantLabel: { type: String, default: null },
  variants: { type: [String], default: [] },
}, { timestamps: true });

productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
