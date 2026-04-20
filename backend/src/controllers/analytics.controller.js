const Expense = require('../models/Expense.model');

/**
 * @desc    Get spending analytics for the logged-in user
 * @route   GET /api/analytics?month=4&year=2026
 * @access  Private
 */
const getAnalytics = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const userId = req.user._id;

    // ─── Aggregation Pipelines ───

    // 1. Spending by category
    const byCategory = await Expense.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          categoryIcon: '$category.icon',
          categoryColor: '$category.color',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // 2. Daily spending trend
    const dailyTrend = await Expense.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total: 1,
          count: 1,
        },
      },
    ]);

    // 3. Monthly totals (income vs expense)
    const monthlyTotals = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalExpense = monthlyTotals.find((t) => t._id === 'expense')?.total || 0;
    const totalIncome = monthlyTotals.find((t) => t._id === 'income')?.total || 0;

    // 4. Payment method breakdown
    const byPaymentMethod = await Expense.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: { month, year },
        summary: {
          totalExpense,
          totalIncome,
          netSavings: totalIncome - totalExpense,
        },
        byCategory,
        dailyTrend,
        byPaymentMethod,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
