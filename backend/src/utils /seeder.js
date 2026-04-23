/**
 
 *  ExpenseIQ — Database Seeder
 *  File: backend/src/utils/seeder.js
 *
 *  Run:   npm run seed          → seed the database
 *  Run:   npm run seed --clean  → wipe + re-seed
 *  Run:   node src/utils/seeder.js --clean
 * ======
 *
 *  Seeds:
 *    • 3  Test Users
 *    • 15 Categories per user  (45 total — icons + hex colors)
 *    • 90 Expenses per user    (270 total — spread across 3 months)
 *    • 9  Budgets per user     (27 total — 3 categories × 3 months)
 */

'use strict';

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
const path     = require('path');

// Load env from backend root 
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Models 
const User         = require('../models/User.model');
const Category     = require('../models/Category.model');
const Expense      = require('../models/Expense.model');
const Budget       = require('../models/Budget.model');
const Notification = require('../models/Notification.model');

//  DB Connection 
const connectDB = require('../config/db');


//  SEED DATA DEFINITIONS


//  3 Test Users 
const USER_DEFINITIONS = [
  {
    name:     'Aryan Mehta',
    email:    'aryan@expenseiq.dev',
    password: 'Test@1234',
    currency: 'INR',
    avatar:   'https://api.dicebear.com/7.x/avataaars/svg?seed=aryan',
  },
  {
    name:     'Priya Sharma',
    email:    'priya@expenseiq.dev',
    password: 'Test@1234',
    currency: 'INR',
    avatar:   'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
  },
  {
    name:     'Rohan Verma',
    email:    'rohan@expenseiq.dev',
    password: 'Test@1234',
    currency: 'INR',
    avatar:   'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan',
  },
];

// ── 15 Category Templates (shared across all users) ──────
//   12 expense categories + 3 income categories
const CATEGORY_TEMPLATES = [
  // ── EXPENSE categories 
  { name: 'Groceries',      icon: '🛒', color: '#10b981', type: 'expense' },
  { name: 'Rent',           icon: '🏠', color: '#6366f1', type: 'expense' },
  { name: 'Transport',      icon: '🚗', color: '#f59e0b', type: 'expense' },
  { name: 'Dining Out',     icon: '🍽️',  color: '#ef4444', type: 'expense' },
  { name: 'Entertainment',  icon: '🎬', color: '#8b5cf6', type: 'expense' },
  { name: 'Healthcare',     icon: '🏥', color: '#06b6d4', type: 'expense' },
  { name: 'Shopping',       icon: '🛍️',  color: '#ec4899', type: 'expense' },
  { name: 'Utilities',      icon: '💡', color: '#84cc16', type: 'expense' },
  { name: 'Education',      icon: '📚', color: '#0ea5e9', type: 'expense' },
  { name: 'Fitness',        icon: '💪', color: '#f97316', type: 'expense' },
  { name: 'Travel',         icon: '✈️',  color: '#14b8a6', type: 'expense' },
  { name: 'Personal Care',  icon: '💆', color: '#a855f7', type: 'expense' },
  // ── INCOME categories ───────────────────────────────────────────
  { name: 'Salary',         icon: '💼', color: '#22c55e', type: 'income'  },
  { name: 'Freelance',      icon: '💻', color: '#3b82f6', type: 'income'  },
  { name: 'Investments',    icon: '📈', color: '#eab308', type: 'income'  },
];

// ── Expense templates per category (title, amount range, payment methods) ─────
//   Used to generate realistic expenses for each category
const EXPENSE_CONFIG = {
  Groceries:     {
    titles: ['D-Mart Weekly Shop', 'Big Bazaar Groceries', 'Reliance Fresh', 'Local Sabzi Mandi', 'Organic Store Run'],
    range:  [400, 2800],
    methods: ['upi', 'debit_card', 'cash'],
    tags:   ['groceries', 'essentials'],
  },
  Rent:          {
    titles: ['Monthly Rent Payment', 'Apartment Rent', 'PG Rent', 'House Rent'],
    range:  [8000, 25000],
    methods: ['net_banking', 'upi'],
    tags:   ['rent', 'housing'],
  },
  Transport:     {
    titles: ['Uber Ride', 'Ola Cab', 'Metro Card Recharge', 'Petrol Fill-up', 'Auto Rickshaw', 'Bus Pass'],
    range:  [80, 1800],
    methods: ['upi', 'cash', 'debit_card'],
    tags:   ['transport', 'commute'],
  },
  'Dining Out':  {
    titles: ['Zomato Order', 'Swiggy Dinner', 'Pizza Hut', 'Café Coffee Day', 'Barbeque Nation', 'McDonald\'s', 'Biryani House'],
    range:  [200, 2500],
    methods: ['upi', 'credit_card', 'cash'],
    tags:   ['food', 'dining'],
  },
  Entertainment: {
    titles: ['Netflix Subscription', 'Movie Tickets — PVR', 'Spotify Premium', 'Amazon Prime', 'BookMyShow', 'Gaming Credits'],
    range:  [149, 1800],
    methods: ['credit_card', 'upi', 'debit_card'],
    tags:   ['entertainment', 'subscriptions'],
  },
  Healthcare:    {
    titles: ['Apollo Pharmacy', 'Doctor Consultation', 'Lab Tests', 'Gym Supplement', '1mg Order', 'Eye Checkup'],
    range:  [200, 3500],
    methods: ['upi', 'cash', 'debit_card'],
    tags:   ['health', 'medical'],
  },
  Shopping:      {
    titles: ['Myntra Haul', 'Amazon Order', 'Flipkart Purchase', 'Decathlon Sports', 'H&M Clothing', 'Nykaa Order'],
    range:  [500, 6000],
    methods: ['credit_card', 'upi', 'debit_card'],
    tags:   ['shopping', 'clothes'],
  },
  Utilities:     {
    titles: ['Electricity Bill', 'Water Bill', 'Internet Recharge', 'Mobile Recharge', 'Gas Cylinder', 'DTH Recharge'],
    range:  [200, 2200],
    methods: ['upi', 'net_banking', 'debit_card'],
    tags:   ['utilities', 'bills'],
  },
  Education:     {
    titles: ['Udemy Course', 'Coursera Subscription', 'Book Purchase', 'Online Coaching', 'AWS Certification Fee'],
    range:  [299, 5000],
    methods: ['credit_card', 'upi', 'debit_card'],
    tags:   ['education', 'learning'],
  },
  Fitness:       {
    titles: ['Gym Membership', 'Yoga Class', 'Protein Powder', 'Running Shoes', 'Cult.fit Session'],
    range:  [400, 3000],
    methods: ['upi', 'credit_card', 'cash'],
    tags:   ['fitness', 'health'],
  },
  Travel:        {
    titles: ['Flight Ticket', 'Hotel Booking', 'Makemytrip Package', 'Irctc Train Ticket', 'Cab Booking', 'Travel Insurance'],
    range:  [800, 18000],
    methods: ['credit_card', 'net_banking', 'upi'],
    tags:   ['travel', 'vacation'],
  },
  'Personal Care': {
    titles: ['Salon Visit', 'Haircut', 'Spa Session', 'Skincare Products', 'Grooming Kit'],
    range:  [200, 2000],
    methods: ['upi', 'cash', 'credit_card'],
    tags:   ['personal', 'grooming'],
  },
};

// ── Income templates ──────────────────────────────────────────────────────────
const INCOME_CONFIG = {
  Salary:      {
    titles: ['Monthly Salary Credit', 'Salary — TCS', 'Salary — Infosys', 'Salary — Wipro'],
    range:  [45000, 95000],
    methods: ['net_banking'],
    tags:   ['salary', 'income'],
  },
  Freelance:   {
    titles: ['Upwork Project Payment', 'Client Invoice — Web Dev', 'UI Design Project', 'Freelance Consulting'],
    range:  [5000, 35000],
    methods: ['upi', 'net_banking'],
    tags:   ['freelance', 'income'],
  },
  Investments: {
    titles: ['Mutual Fund Dividend', 'Stock Dividend', 'FD Interest Credit', 'Zerodha Returns', 'SIP Returns'],
    range:  [500, 8000],
    methods: ['net_banking'],
    tags:   ['investment', 'passive-income'],
  },
};

// ── Budget limits per expense category ────────────────────────────────────────
const BUDGET_LIMITS = {
  Groceries:    5000,
  Rent:         20000,
  Transport:    3000,
  'Dining Out': 4000,
  Entertainment:2000,
  Healthcare:   3000,
  Shopping:     6000,
  Utilities:    2500,
};

// =============================================================================
//  HELPER UTILITIES
// =============================================================================

/** Random integer between min and max (inclusive) */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Random float rounded to 2 decimal places */
const randAmount = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

/** Pick a random element from an array */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generate a random date within a specific month.
 * @param {number} year
 * @param {number} month  — 1-indexed (1 = Jan)
 */
const randomDateInMonth = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const day         = randInt(1, daysInMonth);
  // Spread throughout the day too for realism
  const hour   = randInt(6, 23);
  const minute = randInt(0, 59);
  return new Date(year, month - 1, day, hour, minute, 0);
};


//  CORE SEED FUNCTIONS
// 

/**
 * Create 3 users with hashed passwords.
 * Returns array of saved User documents.
 */
async function seedUsers() {
  const users = [];

  for (const def of USER_DEFINITIONS) {
    const salt     = await bcrypt.genSalt(12);
    const hashed   = await bcrypt.hash(def.password, salt);

    const user = await User.create({
      name:     def.name,
      email:    def.email,
      password: hashed,
      currency: def.currency,
      avatar:   def.avatar,
    });

    users.push(user);
    console.log(`  👤 Created user: ${user.name} <${user.email}>`);
  }

  return users;
}

/**
 * Create 15 categories for each user.
 * Returns a map: userId → { categoryName → Category doc }
 */
async function seedCategories(users) {
  const categoryMap = {};

  for (const user of users) {
    categoryMap[user._id] = {};

    for (const tpl of CATEGORY_TEMPLATES) {
      const cat = await Category.create({
        user:  user._id,
        name:  tpl.name,
        icon:  tpl.icon,
        color: tpl.color,
        type:  tpl.type,
      });

      categoryMap[user._id][tpl.name] = cat;
    }

    console.log(`  📂 Created 15 categories for: ${user.name}`);
  }

  return categoryMap;
}

/**
 * Generate 90 expenses per user spread across 3 months.
 *
 * Distribution per user per month (30 expenses):
 *   - 24 expense transactions across 9 expense categories
 *   - 6  income transactions across 3 income categories (Salary × 1, Freelance × 3, Investment × 2)
 *
 * Months seeded: current month and 2 prior months.
 */
async function seedExpenses(users, categoryMap) {
  const now          = new Date();
  const currentYear  = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  // Build [{ year, month }] for current + 2 previous months
  const months = [];
  for (let offset = 2; offset >= 0; offset--) {
    let m = currentMonth - offset;
    let y = currentYear;
    if (m <= 0) { m += 12; y -= 1; }
    months.push({ year: y, month: m });
  }

  const totalExpenses = [];

  for (const user of users) {
    const cats = categoryMap[user._id];

    for (const { year, month } of months) {
      // 24 EXPENSE transactions 
      //  We cycle through the 9 expense categories with varying counts:
      //  Heavy (4/month): Groceries, Transport, Dining Out, Utilities
      //  Medium (2/month): Entertainment, Healthcare, Shopping, Fitness
      //  Light (2/month):  Personal Care, Education, Travel (total to fill 24)
      const expenseDistribution = [
        { cat: 'Groceries',      count: 4 },
        { cat: 'Transport',      count: 4 },
        { cat: 'Dining Out',     count: 4 },
        { cat: 'Utilities',      count: 2 },
        { cat: 'Shopping',       count: 3 },
        { cat: 'Entertainment',  count: 2 },
        { cat: 'Healthcare',     count: 2 },
        { cat: 'Fitness',        count: 1 },
        { cat: 'Personal Care',  count: 1 },
        { cat: 'Education',      count: 1 },
      ]; // total = 24

      for (const { cat, count } of expenseDistribution) {
        const config = EXPENSE_CONFIG[cat];
        for (let i = 0; i < count; i++) {
          totalExpenses.push({
            user:          user._id,
            title:         pick(config.titles),
            amount:        randAmount(...config.range),
            type:          'expense',
            category:      cats[cat]._id,
            date:          randomDateInMonth(year, month),
            description:   `${cat} expense for ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
            paymentMethod: pick(config.methods),
            tags:          config.tags,
            isRecurring:   cat === 'Rent' || cat === 'Utilities',
            recurringFrequency: (cat === 'Rent' || cat === 'Utilities') ? 'monthly' : undefined,
          });
        }
      }

      // 6 INCOME transactions 
      //  1 Salary + 3 Freelance + 2 Investment = 6 per month
      const incomeDistribution = [
        { cat: 'Salary',      count: 1 },
        { cat: 'Freelance',   count: 3 },
        { cat: 'Investments', count: 2 },
      ];

      for (const { cat, count } of incomeDistribution) {
        const config = INCOME_CONFIG[cat];
        for (let i = 0; i < count; i++) {
          totalExpenses.push({
            user:          user._id,
            title:         pick(config.titles),
            amount:        randAmount(...config.range),
            type:          'income',
            category:      cats[cat]._id,
            date:          randomDateInMonth(year, month),
            description:   `${cat} income — ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
            paymentMethod: pick(config.methods),
            tags:          config.tags,
            isRecurring:   cat === 'Salary',
            recurringFrequency: cat === 'Salary' ? 'monthly' : undefined,
          });
        }
      }
    } // end months loop

    console.log(`  💸 Queued 90 transactions for: ${user.name}`);
  }

  // Bulk insert for performance
  const inserted = await Expense.insertMany(totalExpenses);
  console.log(`  ✅ Inserted ${inserted.length} expense/income records total`);

  return inserted;
}

/**
 * Create monthly budgets for 8 expense categories × 3 months per user.
 * Also calculates and sets the `spent` field from actual seeded expenses.
 */
async function seedBudgets(users, categoryMap) {
  const now          = new Date();
  const currentYear  = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const months = [];
  for (let offset = 2; offset >= 0; offset--) {
    let m = currentMonth - offset;
    let y = currentYear;
    if (m <= 0) { m += 12; y -= 1; }
    months.push({ year: y, month: m });
  }

  const budgetedCategories = Object.keys(BUDGET_LIMITS);
  let budgetCount = 0;

  for (const user of users) {
    const cats = categoryMap[user._id];

    for (const { year, month } of months) {
      for (const catName of budgetedCategories) {
        const cat = cats[catName];

        // Calculate actual spent from the expenses we just seeded
        const agg = await Expense.aggregate([
          {
            $match: {
              user:     user._id,
              category: cat._id,
              type:     'expense',
              date: {
                $gte: new Date(year, month - 1, 1),
                $lte: new Date(year, month, 0, 23, 59, 59),
              },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const spent = agg.length > 0 ? parseFloat(agg[0].total.toFixed(2)) : 0;

        await Budget.create({
          user:     user._id,
          category: cat._id,
          amount:   BUDGET_LIMITS[catName],
          month,
          year,
          spent,
        });

        budgetCount++;
      }
    }

    console.log(`  📊 Created ${budgetedCategories.length * 3} budgets for: ${user.name}`);
  }

  console.log(`  ✅ Inserted ${budgetCount} budget records total`);
}

/**
 * Seed sample notifications (budget alerts) for each user.
 */
async function seedNotifications(users, categoryMap) {
  const now = new Date();
  const notifications = [];

  const currentMonth = now.getMonth() + 1;
  const currentYear  = now.getFullYear();

  for (const user of users) {
    // Pull budgets where spent > 80% for this user
    const budgets = await Budget.find({
      user,
      month: currentMonth,
      year:  currentYear,
    }).populate('category');

    for (const budget of budgets) {
      const pct = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;

      if (pct >= 100) {
        notifications.push({
          user:     user._id,
          title:    `Budget Exceeded — ${budget.category.name}`,
          message:  `You have exceeded your ${budget.category.name} budget of ₹${budget.amount.toLocaleString('en-IN')} this month.`,
          type:     'budget_exceeded',
          severity: 'critical',
          relatedResource: { resourceType: 'Budget', resourceId: budget._id },
          expiresAt: new Date(currentYear, currentMonth, 5), // expires 5th of next month
        });
      } else if (pct >= 80) {
        notifications.push({
          user:     user._id,
          title:    `Budget Alert — ${budget.category.name}`,
          message:  `You've used ${Math.round(pct)}% of your ${budget.category.name} budget (₹${budget.spent.toLocaleString('en-IN')} / ₹${budget.amount.toLocaleString('en-IN')}).`,
          type:     'budget_alert',
          severity: 'warning',
          relatedResource: { resourceType: 'Budget', resourceId: budget._id },
          expiresAt: new Date(currentYear, currentMonth, 5),
        });
      }
    }

    // Welcome notification for every user
    notifications.push({
      user:     user._id,
      title:    'Welcome to ExpenseIQ! 🎉',
      message:  'Your account is set up with sample data. Start tracking your expenses today.',
      type:     'system',
      severity: 'info',
    });
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
    console.log(`  🔔 Inserted ${notifications.length} notifications`);
  }
}


//  WIPE FUNCTION


async function clearDatabase() {
  console.log('\n  🗑️  Clearing existing seed data...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Expense.deleteMany({}),
    Budget.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('  ✅ All collections cleared\n');
}

// =============================================================================
//  MAIN ENTRY POINT
// =============================================================================

async function runSeeder() {
  const isClean = process.argv.includes('--clean');

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║         ExpenseIQ — Database Seeder         ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  try {
    await connectDB();

    if (isClean) {
      await clearDatabase();
    }

    //  Step 1: Users 
    console.log('📌 Step 1/5 — Seeding Users...');
    const users = await seedUsers();
    console.log(`  ✅ ${users.length} users created\n`);

    // Step 2: Categories 
    console.log('📌 Step 2/5 — Seeding Categories...');
    const categoryMap = await seedCategories(users);
    console.log(`  ✅ ${users.length * 15} categories created\n`);

    // Step 3: Expenses 
    console.log('📌 Step 3/5 — Seeding Expenses (90 per user across 3 months)...');
    await seedExpenses(users, categoryMap);
    console.log(`  ✅ ${users.length * 90} transactions inserted\n`);

    // Step 4: Budgets 
    console.log('📌 Step 4/5 — Seeding Budgets...');
    await seedBudgets(users, categoryMap);
    console.log();

    // Step 5: Notifications 
    console.log('📌 Step 5/5 — Seeding Notifications...');
    await seedNotifications(users, categoryMap);
    console.log();

    // Summary
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║              ✅ Seed Complete!               ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║  Users         : ${String(users.length).padEnd(28)}║`);
    console.log(`║  Categories    : ${String(users.length * 15).padEnd(28)}║`);
    console.log(`║  Transactions  : ${String(users.length * 90).padEnd(28)}║`);
    console.log(`║  Budgets       : ${String(users.length * 24).padEnd(28)}║`);
    console.log('╠══════════════════════════════════════════════╣');
    console.log('║  Test Credentials (all users):               ║');
    console.log('║  aryan@expenseiq.dev  / Test@1234            ║');
    console.log('║  priya@expenseiq.dev  / Test@1234            ║');
    console.log('║  rohan@expenseiq.dev  / Test@1234            ║');
    console.log('╚══════════════════════════════════════════════╝\n');

  } catch (err) {
    console.error('\n❌ Seeder failed:', err.message);
    if (err.code === 11000) {
      console.error('   ➜ Duplicate key error — database may already be seeded.');
      console.error('   ➜ Run with --clean flag to wipe and re-seed:\n');
      console.error('      npm run seed -- --clean\n');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected. Goodbye!\n');
    process.exit(0);
  }
}

runSeeder();
  
