const express = require('express');
const router = express.Router();
const { getBudgets, upsertBudget, updateBudget } = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate, validateQuery } = require('../middleware/validate.middleware');
const { upsertBudgetSchema, updateBudgetSchema, budgetQuerySchema } = require('../validators');

router.use(protect);

router.route('/').get(validateQuery(budgetQuerySchema), getBudgets).post(validate(upsertBudgetSchema), upsertBudget);
router.route('/:id').put(validate(updateBudgetSchema), updateBudget);

module.exports = router;