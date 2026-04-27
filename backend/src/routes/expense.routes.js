const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  searchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate, validateQuery } = require('../middleware/validate.middleware');
const {
  createExpenseSchema,
  updateExpenseSchema,
  paginationSchema,
  searchQuerySchema,
} = require('../validators');

router.use(protect); // All expense routes are private

router.route('/').get(validateQuery(paginationSchema), getExpenses).post(validate(createExpenseSchema), createExpense);
router.route('/search').get(validateQuery(searchQuerySchema), searchExpenses);
router.route('/:id').get(getExpenseById).put(validate(updateExpenseSchema), updateExpense).delete(deleteExpense);

module.exports = router;
