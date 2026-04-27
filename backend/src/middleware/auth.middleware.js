const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * Protect routes — verify JWT token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        const error = new Error('User not found');
        error.statusCode = 401;
        return next(error);
      }

      next();
    } catch (_error) {
      const error = new Error('Not authorized — invalid token');
      error.statusCode = 401;
      return next(error);
    }
  } else {
    const error = new Error('Not authorized — no token provided');
    error.statusCode = 401;
    return next(error);
  }
};

module.exports = { protect };
