const HttpError = require('../utils/HttpError');

function notFound(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  let status = error.status || 500;
  let message = error.message || 'Internal server error.';

  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Please check the submitted data.';
  } else if (error instanceof SyntaxError && Object.prototype.hasOwnProperty.call(error, 'body')) {
    status = 400;
    message = 'Request body must be valid JSON.';
  } else if (error.name === 'CastError') {
    status = 400;
    message = 'The requested identifier is invalid.';
  } else if (error.code === 11000) {
    status = 409;
    message = 'A record with those details already exists.';
  }

  if (status >= 500) {
    console.error(error);
    message = 'The server could not complete the request.';
  }

  if (res.headersSent) return next(error);
  return res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
