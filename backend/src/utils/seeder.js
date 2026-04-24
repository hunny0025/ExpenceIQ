/**
 *  ExpenseIQ — Database Seeder
 *  File: backend/src/utils/seeder.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Expense = require('../models/Expense.model');
const Budget = require('../models/Budget.model');

dotenv.config();

const BUDGET_LIMITS = {
  'Food & Dining': 12000,
  'Housing & Rent': 25000,
  'Transport': 5000,
  'Shopping': 8000,
  'Health': 3000,
  'Entertainment': 4000,
  'Personal': 5000,
  'Misc': 2000
};

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`  ✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`  ❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
}

async function seedUsers() {
  const password = 'Test@1234';
  const users = [
    { name: 'Aryan Sharma', email: 'aryan@expenseiq.dev', password },
    { name: 'Priya Verma', email: 'priya@expenseiq.dev', password },
    { name: 'Rohan Gupta', email: 'rohan@expenseiq.dev', password }
  ];

  const createdUsers = [];
  for (const u of users) {
    const user = new User({ name: u.name, email: u.email, passwordHash: u.password });
    await user.save();
    createdUsers.push(user);
  }
  return createdUsers;
}

async function seedCategories(users) {
  const commonCategories = [
    { name: 'Food & Dining', icon: 'utensils', color: '#ef4444' },
    { name: 'Housing & Rent', icon: 'home', color: '#3b82f6' },
    { name: 'Transport', icon: 'car', color: '#10b981' },
    { name: 'Shopping', icon: 'shopping-bag', color: '#f59e0b' },
    { name: 'Health', icon: 'activity', color: '#ec4899' },
    { name: 'Entertainment', icon: 'film', color: '#8b5cf6' },
    { name: 'Personal', icon: 'user', color: '#6366f1' },
    { name: 'Misc', icon: 'layers', color: '#64748b' }
  ];

  const categoryMap = {};
  for (const user of users) {
    categoryMap[user._id] = {};
    for (const cat of commonCategories) {
      const created = await Category.create({ ...cat, userId: user._id });
      categoryMap[user._id][cat.name] = created;
    }
  }
  return categoryMap;
}

async function seedExpenses(users, categoryMap) {
  const totalExpenses = [];
  const now = new Date();

  for (const user of users) {
    // eslint-disable-next-line no-unused-vars
    const _cats = categoryMap[user._id];

    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);

      // Randomized Expenses
      const expenseCats = ['Food & Dining', 'Housing & Rent', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Personal', 'Misc'];
      for (let i = 0; i < 30; i++) {
        const catName = expenseCats[Math.floor(Math.random() * expenseCats.length)];
        const amount = Math.floor(Math.random() * 2000) + 100;
        totalExpenses.push({
          userId: user._id,
          category: catName,
          amount,
          description: `Sample ${catName} expense`,
          date: new Date(monthDate.getTime() + Math.random() * 2592000000)
        });
      }
    }
  }

  const inserted = await Expense.insertMany(totalExpenses);
  return inserted;
}

async function seedBudgets(users, categoryMap) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  for (const user of users) {
    const cats = categoryMap[user._id];
    for (const [catName, limit] of Object.entries(BUDGET_LIMITS)) {
      const cat = cats[catName];

      await Budget.create({
        userId: user._id,
        categoryId: cat._id,
        amount: limit,
        month: currentMonth,
        year: currentYear
      });
    }
  }
}

async function clearDatabase() {
  console.log('\n  🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Expense.deleteMany({}),
    Budget.deleteMany({})
  ]);
  console.log('  ✅ Database cleared\n');
}

async function runSeeder() {
  const isClean = process.argv.includes('--clean');
  try {
    await connectDB();
    if (isClean) await clearDatabase();

    console.log('📌 Seeding Users...');
    const users = await seedUsers();

    console.log('📌 Seeding Categories...');
    const categoryMap = await seedCategories(users);

    console.log('📌 Seeding Expenses...');
    await seedExpenses(users, categoryMap);

    console.log('📌 Seeding Budgets...');
    await seedBudgets(users, categoryMap);

    console.log('✅ Seed Complete!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeder failed:', err.message);
    process.exit(1);
  }
}

runSeeder();