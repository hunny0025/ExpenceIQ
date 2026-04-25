const Expense = require('../models/Expense.model');

/**
 * @desc    Get all expenses for logged-in user
 * @route   GET /api/expenses
 * @access  Private
 */
const getExpenses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = '-date',
      category,
      startDate,
      endDate,
      search,
    } = req.query;

    // Build filter query
    const filter = { userId: req.user.id };

    if (category) filter.category = category;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Text search on description
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Expense.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new expense
 * @route   POST /api/expenses
 * @access  Private
 */
const createExpense = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    const expense = await Expense.create(req.body);

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
const updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Make sure user owns the expense
    if (expense.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this expense');
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    if (expense.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this expense');
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search expenses for logged-in user
 * @route   GET /api/expenses/search
 * @access  Private
 */
const searchExpenses = async (req, res, next) => {
  try {
    const {
      q,
      page = 1,
      limit = 20,
      sort = '-date',
      category,
      startDate,
      endDate,
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query (q) is required',
      });
    }

    // Build filter query
    const filter = { userId: req.user.id };

    // Text search on description and tags
    filter.$or = [
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];

    if (category) filter.category = category;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Expense.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExpenses, searchExpenses, createExpense, updateExpense, deleteExpense };
