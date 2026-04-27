const mongoose = require('mongoose');
const Budget = require('../models/Budget.model');
const Expense = require('../models/Expense.model');

/**
 * @desc    Get budgets for a given month/year with spent calculation
 * @route   GET /api/budgets?month=4&year=2026
 * @access  Private
 */
const getBudgets = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Get start and end of month (use string to avoid timezone issues)
    const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`);
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = new Date(`${year}-${String(month).padStart(2, '0')}-${lastDay}T23:59:59.999Z`);

    // Get budgets for user
    const budgets = await Budget.find({
      userId: req.user.id,
      month,
      year,
    }).populate('categoryId', 'name icon color');

    // Calculate spent for each budget from expenses
    const categoryIds = budgets.map(b => b.categoryId._id);
    const userIdObj = new mongoose.Types.ObjectId(req.user.id.toString());

    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: userIdObj,
          category: { $in: categoryIds },
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Map spent amounts to budgets
    const spentMap = {};
    expenses.forEach(exp => {
      spentMap[exp._id.toString()] = exp.total;
    });

    // Add spent to each budget
    const budgetsWithSpent = budgets.map(budget => {
      const categoryId = budget.categoryId._id.toString();
      const spent = spentMap[categoryId] || 0;
      return {
        _id: budget._id,
        categoryId: budget.categoryId,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
        spent,
        remaining: budget.amount - spent,
        percentUsed: Math.min(Math.round((spent / budget.amount) * 100), 100),
      };
    });

    res.status(200).json({
      success: true,
      count: budgetsWithSpent.length,
      data: budgetsWithSpent,
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
    const { categoryId, amount, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      {
        userId: req.user.id,
        categoryId,
        month,
        year,
      },
      {
        userId: req.user.id,
        categoryId,
        amount,
        month,
        year,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate('categoryId', 'name icon color');

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a budget
 * @route   PUT /api/budgets/:id
 * @access  Private
 */
const updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this budget',
      });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('categoryId', 'name icon color');

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudgets, upsertBudget, updateBudget };