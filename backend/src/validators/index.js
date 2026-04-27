const Joi = require('joi');

// Auth validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Expense validation schemas
const createExpenseSchema = Joi.object({
  amount: Joi.number().positive().required(),
  category: Joi.string().required(),
  description: Joi.string().max(500).allow(''),
  date: Joi.date().iso(),
  tags: Joi.array().items(Joi.string()),
  receiptUrl: Joi.string().uri().allow(''),
});

const updateExpenseSchema = Joi.object({
  amount: Joi.number().positive(),
  category: Joi.string(),
  description: Joi.string().max(500).allow(''),
  date: Joi.date().iso(),
  tags: Joi.array().items(Joi.string()),
  receiptUrl: Joi.string().uri().allow(''),
});

// Budget validation schemas
const upsertBudgetSchema = Joi.object({
  categoryId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).max(2100).required(),
});

const updateBudgetSchema = Joi.object({
  amount: Joi.number().positive(),
});

// Category validation schemas
const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  icon: Joi.string().max(50).allow(''),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).allow(''),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50),
  icon: Joi.string().max(50).allow(''),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).allow(''),
});

// Search query validation
const searchQuerySchema = Joi.object({
  q: Joi.string().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  category: Joi.string(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});

// Pagination query validation
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().default('-date'),
  category: Joi.string(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});

// Budget query validation
const budgetQuerySchema = Joi.object({
  month: Joi.number().integer().min(1).max(12),
  year: Joi.number().integer().min(2000).max(2100),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  createExpenseSchema,
  updateExpenseSchema,
  upsertBudgetSchema,
  updateBudgetSchema,
  createCategorySchema,
  updateCategorySchema,
  searchQuerySchema,
  paginationSchema,
  budgetQuerySchema,
};