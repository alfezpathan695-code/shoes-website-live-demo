const express = require('express');
const { body, param, query } = require('express-validator');
const productController = require('../controllers/productController');
const { authorize, protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const categories = ['Women', 'Men', 'Girls', 'Boys', 'Kids', 'Home', 'Beauty', 'Accessories', 'Electronics', 'Kitchen', 'Shoes'];
const router = express.Router();

const productBodyValidators = (partial = false) => [
  ...(!partial ? [body('productId').isInt({ min: 1 })] : []),
  (partial ? body('name').optional() : body('name')).isString().trim().isLength({ min: 2, max: 160 }),
  (partial ? body('category').optional() : body('category')).isIn(categories),
  (partial ? body('price').optional() : body('price')).isFloat({ min: 0 }),
  (partial ? body('oldPrice').optional() : body('oldPrice')).isFloat({ min: 0 }),
  (partial ? body('rating').optional() : body('rating')).isFloat({ min: 0, max: 5 }),
  (partial ? body('reviews').optional() : body('reviews')).isInt({ min: 0 }),
  body('badge').optional().isString().trim().isLength({ max: 40 }),
  (partial ? body('image').optional() : body('image')).isString().trim().notEmpty(),
  (partial ? body('color').optional() : body('color')).matches(/^#[0-9a-f]{6}$/i),
  body('variantLabel').optional({ nullable: true }).isString().trim().isLength({ max: 30 }),
  body('variants').optional().isArray({ max: 30 }),
  body('variants.*').optional().isString().trim().isLength({ min: 1, max: 40 }),
];

router.get('/', [
  query('category').optional().isIn(categories),
  query('q').optional().isString().trim().isLength({ max: 80 }),
  query('sort').optional().isIn(['recommended', 'price-low', 'price-high', 'rating']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 200 }),
], validateRequest, productController.listProducts);

router.get('/:id', [param('id').isInt({ min: 1 })], validateRequest, productController.getProduct);
router.post('/', protect, authorize('admin'), productBodyValidators(), validateRequest, productController.createProduct);
router.patch('/:id', protect, authorize('admin'), [
  param('id').isInt({ min: 1 }),
  ...productBodyValidators(true),
], validateRequest, productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), [param('id').isInt({ min: 1 })], validateRequest, productController.deleteProduct);

module.exports = router;
