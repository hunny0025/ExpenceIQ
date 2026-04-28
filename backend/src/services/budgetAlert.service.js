const mongoose = require('mongoose');
const budgetEvents = require('../events/budget.events');
const Notification = require('../models/Notification.model');
const Budget = require('../models/Budget.model');
const Expense = require('../models/Expense.model');

const THRESHOLD_PERCENT = 80;

// Check if budget threshold is reached and emit event
const checkBudgetThreshold = async (expense) => {
  const expenseDate = new Date(expense.date);
  const month = expenseDate.getMonth() + 1;
  const year = expenseDate.getFullYear();

  // Find budget for this category name
  const budgets = await Budget.find({
    userId: expense.userId,
    month,
    year,
  }).populate('categoryId', 'name');

  const matchingBudget = budgets.find(b => b.categoryId?.name === expense.category);
  if (!matchingBudget) return;

  const categoryName = matchingBudget.categoryId.name;
  const budgetAmount = matchingBudget.amount;
  const budgetId = matchingBudget._id;
  const categoryId = matchingBudget.categoryId._id;

  // Calculate spent from all expenses in this month
  const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`);
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = new Date(`${year}-${String(month).padStart(2, '0')}-${lastDay}T23:59:59.999Z`);

  const expensesResult = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(expense.userId.toString()),
        category: categoryName,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const spent = expensesResult[0]?.total || 0;
  const percentUsed = Math.round((spent / budgetAmount) * 100);

  if (percentUsed >= 100) {
    budgetEvents.emit(budgetEvents.BUDGET_EXCEEDED, {
      userId: expense.userId,
      categoryId,
      categoryName,
      budgetId,
      spent,
      budgetAmount,
      percentUsed,
    });
  } else if (percentUsed >= THRESHOLD_PERCENT) {
    budgetEvents.emit(budgetEvents.BUDGET_THRESHOLD, {
      userId: expense.userId,
      categoryId,
      categoryName,
      budgetId,
      spent,
      budgetAmount,
      percentUsed,
    });
  }
};

// Initialize event listeners
const initializeBudgetAlertListeners = () => {
  budgetEvents.on(budgetEvents.BUDGET_THRESHOLD, async (data) => {
    try {
      // Check if we already sent a notification recently (within last 24 hours)
      const recentNotification = await Notification.findOne({
        user: data.userId,
        type: 'budget_alert',
        'relatedResource.resourceId': data.budgetId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      if (recentNotification) return;

      await Notification.create({
        user: data.userId,
        title: 'Budget Alert',
        message: `Your ${data.categoryName} budget is at ${data.percentUsed}% (${data.spent}/${data.budgetAmount})`,
        type: 'budget_alert',
        severity: 'warning',
        relatedResource: {
          resourceType: 'Budget',
          resourceId: data.budgetId,
        },
      });
    } catch (error) {
      console.error('Failed to create budget threshold notification:', error);
    }
  });

  budgetEvents.on(budgetEvents.BUDGET_EXCEEDED, async (data) => {
    try {
      await Notification.create({
        user: data.userId,
        title: 'Budget Exceeded',
        message: `Your ${data.categoryName} budget has been exceeded! (${data.spent}/${data.budgetAmount})`,
        type: 'budget_exceeded',
        severity: 'critical',
        relatedResource: {
          resourceType: 'Budget',
          resourceId: data.budgetId,
        },
      });
    } catch (error) {
      console.error('Failed to create budget exceeded notification:', error);
    }
  });
};

module.exports = {
  checkBudgetThreshold,
  initializeBudgetAlertListeners,
  THRESHOLD_PERCENT,
};