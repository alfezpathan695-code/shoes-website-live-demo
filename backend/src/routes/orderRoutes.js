const express = require('express');
const { body, param } = require('express-validator');
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.post('/', [
  body('items').isArray({ min: 1, max: 50 }),
  body('items.*.productId').isInt({ min: 1 }),
  body('items.*.quantity').isInt({ min: 1, max: 20 }),
  body('items.*.variant').optional().isString().trim().isLength({ max: 40 }),
  body('shippingAddress').isObject(),
  body('shippingAddress.fullName').isString().trim().isLength({ min: 2, max: 100 }),
  body('shippingAddress.phone').matches(/^[6-9]\d{9}$/),
  body('shippingAddress.addressLine').isString().trim().isLength({ min: 8, max: 240 }),
  body('shippingAddress.city').isString().trim().isLength({ min: 2, max: 80 }),
  body('shippingAddress.state').isString().trim().isLength({ min: 2, max: 80 }),
  body('shippingAddress.pincode').matches(/^\d{6}$/),
], validateRequest, orderController.createOrder);

router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', [param('id').isMongoId()], validateRequest, orderController.getOrder);

module.exports = router;
