const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createCategorySchema, updateCategorySchema } = require('../validators');

router.use(protect);

router.route('/').get(getCategories).post(validate(createCategorySchema), createCategory);
router.route('/:id').put(validate(updateCategorySchema), updateCategory).delete(deleteCategory);

module.exports = router;
