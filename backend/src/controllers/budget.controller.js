const Budget = require('../models/Budget.model');

/**
 * @desc    Get budgets for a given month/year
 * @route   GET /api/budgets?month=4&year=2026
 * @access  Private
 */
const getBudgets = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const budgets = await Budget.find({
      user: req.user.id,
      month,
      year,
    }).populate('category', 'name icon color');

    res.status(200).json({
      success: true,
      count: budgets.length,
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or update a budget
 * @route   POST /api/budgets
 * @access  Private
 */
const upsertBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user.id,
        category,
        month,
        year,
      },
      {
        user: req.user.id,
        category,
        amount,
        month,
        year,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate('category', 'name icon color');

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a budget
 * @route   DELETE /api/budgets/:id
 * @access  Private
 */
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    if (budget.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this budget');
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudgets, upsertBudget, deleteBudget };
