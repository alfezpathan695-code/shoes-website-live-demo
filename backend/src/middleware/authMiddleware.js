const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/HttpError');

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Please sign in to continue.');
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new HttpError(401, 'Your session is invalid or has expired. Please sign in again.');
    }
    throw error;
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new HttpError(401, 'This account is no longer available.');
  }
  req.user = user;
  next();
});

function authorize(...roles) {
  return function checkRole(req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, 'You do not have permission to do that.'));
    }
    return next();
  };
}

module.exports = { protect, authorize };
