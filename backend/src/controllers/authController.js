const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/HttpError');

function createToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

const register = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json({ user: publicUser(user), token: createToken(user) });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new HttpError(401, 'Email or password is incorrect.');
  }

  res.json({ user: publicUser(user), token: createToken(user) });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = { register, login, getCurrentUser };
