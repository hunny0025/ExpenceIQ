/**
 *  ExpenseIQ — Database Seeder
 *  File: backend/src/utils/seeder.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Expense } from '../models/expense.model.js';
import { Budget } from '../models/budget.model.js';
import { Notification } from '../models/notification.model.js';

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
  const password = 'Test@1234'; // All seeded users use this password
  const users = [
    { name: 'Aryan Sharma', email: 'aryan@expenseiq.dev', password },
    { name: 'Priya Verma', email: 'priya@expenseiq.dev', password },
    { name: 'Rohan Gupta', email: 'rohan@expenseiq.dev', password }
  ];

  const createdUsers = [];
  for (const u of users) {
    const user = new User(u);
    await user.save();
    createdUsers.push(user);
  }
  return createdUsers;
}

async function seedCategories(users) {
  const commonCategories = [
    { name: 'Food & Dining', icon: 'utensils', type: 'expense' },
    { name: 'Housing & Rent', icon: 'home', type: 'expense' },
    { name: 'Transport', icon: 'car', type: 'expense' },
    { name: 'Shopping', icon: 'shopping-bag', type: 'expense' },
    { name: 'Health', icon: 'activity', type: 'expense' },
    { name: 'Entertainment', icon: 'film', type: 'expense' },
    { name: 'Personal', icon: 'user', type: 'expense' },
    { name: 'Misc', icon: 'layers', type: 'expense' },
    { name: 'Salary', icon: 'wallet', type: 'income' },
    { name: 'Freelance', icon: 'briefcase', type: 'income' },
    { name: 'Investment', icon: 'trending-up', type: 'income' }
  ];

  const categoryMap = {};
  for (const user of users) {
    categoryMap[user._id] = {};
    for (const cat of commonCategories) {
      const created = await Category.create({ ...cat, user: user._id });
      categoryMap[user._id][cat.name] = created;
    }
  }
  return categoryMap;
}

async function seedExpenses(users, categoryMap) {
  const totalExpenses = [];
  const now = new Date();
  
  for (const user of users) {
    const cats = categoryMap[user._id];
    
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      
      // Income
      totalExpenses.push({
        user: user._id,
        category: cats['Salary']._id,
        amount: 50000,
        type: 'income',
        description: 'Monthly Salary',
        date: monthDate
      });

      // Randomized Expenses
      const expenseCats = ['Food & Dining', 'Housing & Rent', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Personal', 'Misc'];
      for (let i = 0; i < 30; i++) {
        const catName = expenseCats[Math.floor(Math.random() * expenseCats.length)];
        const amount = Math.floor(Math.random() * 2000) + 100;
        totalExpenses.push({
          user: user._id,
          category: cats[catName]._id,
          amount,
          type: 'expense',
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
      
      const agg = await Expense.aggregate([
        { $match: { user: user._id, category: cat._id, type: 'expense', 
          date: { $gte: new Date(currentYear, currentMonth - 1, 1), $lte: new Date(currentYear, currentMonth, 0) } 
        } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const spent = agg.length > 0 ? agg[0].total : 0;

      await Budget.create({
        user: user._id,
        category: cat._id,
        amount: limit,
        month: currentMonth,
        year: currentYear,
        spent
      });
    }
  }
}

async function seedNotifications(users) {
  for (const user of users) {
    await Notification.create({
      user: user._id,
      title: 'Welcome to ExpenseIQ! 🎉',
      message: 'Your account is set up with sample data. Start tracking your expenses today.',
      type: 'system',
      severity: 'info'
    });
  }
}

async function clearDatabase() {
  console.log('\n  🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Expense.deleteMany({}),
    Budget.deleteMany({}),
    Notification.deleteMany({}),
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
    
    console.log('📌 Seeding Notifications...');
    await seedNotifications(users);

    console.log('✅ Seed Complete!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeder failed:', err.message);
    process.exit(1);
  }
}

runSeeder();
