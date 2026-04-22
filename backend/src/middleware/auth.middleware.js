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
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (_error) {
      res.status(401);
      next(new Error('Not authorized — invalid token'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized — no token provided'));
  }
};

module.exports = { protect };
