const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/register', [
  body('name').isString().trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 72 }),
], validateRequest, authController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
], validateRequest, authController.login);

router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
