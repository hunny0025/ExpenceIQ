const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide a budget amount'],
      min: [1, 'Budget must be at least 1'],
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    spent: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Unique budget per user + category + month + year
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

// Virtual for remaining budget
budgetSchema.virtual('remaining').get(function () {
  return this.amount - this.spent;
});

// Virtual for percentage used
budgetSchema.virtual('percentUsed').get(function () {
  return Math.min(Math.round((this.spent / this.amount) * 100), 100);
});

// Include virtuals in JSON output
budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Budget', budgetSchema);
