/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler - consistent JSON error responses
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  // Make error messages user-friendly
  let message = err.message;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const validationMessages = Object.values(err.errors).map(e => e.message);
    message = validationMessages.join(', ');
  }

  // Handle Mongoose CastError (invalid ObjectId or date)
  if (err.name === 'CastError') {
    if (err.kind === 'ObjectId') {
      message = 'Invalid ID format';
    } else if (err.kind === 'Date') {
      message = 'Please provide a valid date';
    } else {
      message = 'Invalid data format';
    }
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    message = 'Duplicate entry. This record already exists';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    return res.status(401).json({ success: false, message });
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    return res.status(401).json({ success: false, message });
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
