const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      maxlength: [30, 'Category name cannot exceed 30 characters'],
    },
    icon: {
      type: String,
      default: '📦',
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#([A-Fa-f0-9]{6})$/, 'Please provide a valid hex color'],
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index — prevent duplicate category names per user
categorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
