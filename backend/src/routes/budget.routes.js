const express = require('express');
const router = express.Router();
const { getBudgets, upsertBudget, updateBudget } = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getBudgets).post(upsertBudget);
router.route('/:id').put(updateBudget);

module.exports = router;