const express = require('express');
const router = express.Router();
const {
  getExpenses,
  searchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All expense routes are private

router.route('/').get(getExpenses).post(createExpense);
router.route('/search').get(searchExpenses);
router.route('/:id').put(updateExpense).delete(deleteExpense);

module.exports = router;
