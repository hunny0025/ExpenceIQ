# ExpenseIQ — MongoDB Schema Documentation

> **Version:** 1.0.0 | **Database:** MongoDB Atlas | **ODM:** Mongoose 7.x
>
> This document is the single source of truth for all collections, fields, types, constraints, indexes, and relationships in the ExpenseIQ database.

---

## Table of Contents

- [Overview](#overview)
- [Collection 1 — Users](#collection-1--users)
- [Collection 2 — Expenses](#collection-2--expenses)
- [Collection 3 — Categories](#collection-3--categories)
- [Collection 4 — Budgets](#collection-4--budgets)
- [Collection 5 — Notifications](#collection-5--notifications)
- [Index Master Reference](#index-master-reference)
- [Relationships & ERD](#relationships--erd)
- [Mongoose Schema Code Reference](#mongoose-schema-code-reference)

---

## Overview

| Collection | Model File | Purpose |
|---|---|---|
| `users` | `User.model.js` | Authentication, profile, currency preference |
| `expenses` | `Expense.model.js` | All income and expense transactions |
| `categories` | `Category.model.js` | User-defined expense/income categories |
| `budgets` | `Budget.model.js` | Monthly budget limits per category |
| `notifications` | `Notification.model.js` | Budget alerts, reminders, system messages |

---

## Collection 1 — Users

**Model file:** `backend/src/models/User.model.js`
**Mongoose model name:** `User`
**MongoDB collection:** `users`

### Fields

| Field | Mongoose Type | JS Type | Required | Default | Constraints |
|---|---|---|---|---|---|
| `_id` | `ObjectId` | — | Auto | — | MongoDB primary key, auto-generated |
| `name` | `String` | string | ✅ Yes | — | `trim: true`, `maxlength: 50` |
| `email` | `String` | string | ✅ Yes | — | `unique`, `lowercase`, `trim`, regex email format |
| `password` | `String` | string | ✅ Yes | — | `minlength: 6`, `select: false` (never returned in queries) |
| `currency` | `String` | string | No | `"INR"` | `enum: ["INR", "USD", "EUR", "GBP"]` |
| `avatar` | `String` | string | No | `""` | URL to profile image |
| `createdAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |
| `updatedAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |

### Indexes

| Index Name | Fields | Type | Purpose |
|---|---|---|---|
| `email_1` | `{ email: 1 }` | **Unique** | Prevent duplicate accounts, fast login lookup |

> **Note:** `unique: true` on the `email` field in the schema definition creates an implicit unique index. The explicit `userSchema.index({ email: 1 })` ensures Mongoose also registers it for compound query optimisation.

### Hooks & Methods

| Type | Name | Description |
|---|---|---|
| Pre-save Hook | — | Hashes `password` with bcrypt (salt rounds: 12) before every save if modified |
| Instance Method | `matchPassword(enteredPassword)` | `bcrypt.compare()` — returns `true/false` |
| Instance Method | `getSignedJwtToken()` | Returns a signed JWT using `JWT_SECRET`, expires in `JWT_EXPIRE` (default `7d`) |

### Sample Document

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "$2b$12$hashed...",
  "currency": "INR",
  "avatar": "https://cdn.example.com/avatars/priya.jpg",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

---

## Collection 2 — Expenses

**Model file:** `backend/src/models/Expense.model.js`
**Mongoose model name:** `Expense`
**MongoDB collection:** `expenses`

### Fields

| Field | Mongoose Type | JS Type | Required | Default | Constraints |
|---|---|---|---|---|---|
| `_id` | `ObjectId` | — | Auto | — | MongoDB primary key |
| `user` | `ObjectId` | ref → `User` | ✅ Yes | — | Foreign key, indexed |
| `title` | `String` | string | ✅ Yes | — | `trim: true`, `maxlength: 100` |
| `amount` | `Number` | number | ✅ Yes | — | `min: 0.01` |
| `type` | `String` | string | No | `"expense"` | `enum: ["expense", "income"]` |
| `category` | `ObjectId` | ref → `Category` | ✅ Yes | — | Foreign key |
| `date` | `Date` | Date | ✅ Yes | `Date.now` | Transaction date (not creation date) |
| `description` | `String` | string | No | — | `trim: true`, `maxlength: 500` |
| `paymentMethod` | `String` | string | No | `"cash"` | `enum: ["cash", "credit_card", "debit_card", "upi", "net_banking", "other"]` |
| `tags` | `[String]` | string[] | No | `[]` | Array of trimmed tag strings |
| `isRecurring` | `Boolean` | boolean | No | `false` | Marks recurring transactions |
| `recurringFrequency` | `String` | string | No | — | `enum: ["daily", "weekly", "monthly", "yearly"]` — only meaningful when `isRecurring: true` |
| `createdAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |
| `updatedAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |

### Indexes

| Index Name | Fields | Type | Purpose |
|---|---|---|---|
| `user_1_date_-1` | `{ user: 1, date: -1 }` | **Compound** | Fetch all expenses for a user sorted by date (dashboard feed, pagination) |
| `user_1_category_1` | `{ user: 1, category: 1 }` | **Compound** | Filter expenses by category (analytics, category breakdown) |
| `user_1_type_1_date_-1` | `{ user: 1, type: 1, date: -1 }` | **Compound** | Separate income vs expense queries over time (cash flow charts) |

> **Why compound indexes?** MongoDB can only use one index per query. Compound indexes on `(user + date)` mean a single index serves both the user-filter and the sort — no full collection scan needed.

### Sample Document

```json
{
  "_id": "64f1b3c4d5e6f7a8b9c0d2e3",
  "user": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Grocery Shopping",
  "amount": 1850.50,
  "type": "expense",
  "category": "64f1c4d5e6f7a8b9c0d3e4f5",
  "date": "2025-01-20T00:00:00.000Z",
  "description": "Weekly groceries at D-Mart",
  "paymentMethod": "upi",
  "tags": ["groceries", "essentials"],
  "isRecurring": false,
  "recurringFrequency": null,
  "createdAt": "2025-01-20T08:15:00.000Z",
  "updatedAt": "2025-01-20T08:15:00.000Z"
}
```

---

## Collection 3 — Categories

**Model file:** `backend/src/models/Category.model.js`
**Mongoose model name:** `Category`
**MongoDB collection:** `categories`

### Fields

| Field | Mongoose Type | JS Type | Required | Default | Constraints |
|---|---|---|---|---|---|
| `_id` | `ObjectId` | — | Auto | — | MongoDB primary key |
| `user` | `ObjectId` | ref → `User` | ✅ Yes | — | Foreign key — categories are per-user |
| `name` | `String` | string | ✅ Yes | — | `trim: true`, `maxlength: 30` |
| `icon` | `String` | string | No | `"📦"` | Emoji or icon string for UI display |
| `color` | `String` | string | No | `"#6366f1"` | Hex color code, validated with regex `^#([A-Fa-f0-9]{6})$` |
| `type` | `String` | string | No | `"expense"` | `enum: ["expense", "income"]` |
| `createdAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |
| `updatedAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |

### Indexes

| Index Name | Fields | Type | Purpose |
|---|---|---|---|
| `user_1_name_1` | `{ user: 1, name: 1 }` | **Unique Compound** | Prevent a user from creating two categories with the same name; also speeds up category lookup by name |

> **Uniqueness scope:** The unique constraint is per-user, not global. Two different users can both have a category named "Food". The combination `(userId + name)` must be unique.

### Sample Document

```json
{
  "_id": "64f1c4d5e6f7a8b9c0d3e4f5",
  "user": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Groceries",
  "icon": "🛒",
  "color": "#10b981",
  "type": "expense",
  "createdAt": "2025-01-10T09:00:00.000Z",
  "updatedAt": "2025-01-10T09:00:00.000Z"
}
```

---

## Collection 4 — Budgets

**Model file:** `backend/src/models/Budget.model.js`
**Mongoose model name:** `Budget`
**MongoDB collection:** `budgets`

### Fields

| Field | Mongoose Type | JS Type | Required | Default | Constraints |
|---|---|---|---|---|---|
| `_id` | `ObjectId` | — | Auto | — | MongoDB primary key |
| `user` | `ObjectId` | ref → `User` | ✅ Yes | — | Foreign key |
| `category` | `ObjectId` | ref → `Category` | ✅ Yes | — | Foreign key |
| `amount` | `Number` | number | ✅ Yes | — | Budget limit, `min: 1` |
| `month` | `Number` | number | ✅ Yes | — | `min: 1`, `max: 12` — calendar month |
| `year` | `Number` | number | ✅ Yes | — | e.g. `2025` |
| `spent` | `Number` | number | No | `0` | Tracked spend so far, `min: 0` — updated as expenses are logged |
| `createdAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |
| `updatedAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |

### Virtual Fields

> Virtuals are computed at read time — they are **not stored** in MongoDB. Available via `toJSON()` and `toObject()`.

| Virtual | Formula | Example |
|---|---|---|
| `remaining` | `amount - spent` | `5000 - 3200 = 1800` |
| `percentUsed` | `Math.min(round((spent / amount) * 100), 100)` | `64%` |

### Indexes

| Index Name | Fields | Type | Purpose |
|---|---|---|---|
| `user_1_category_1_month_1_year_1` | `{ user: 1, category: 1, month: 1, year: 1 }` | **Unique Compound** | Enforce one budget per user per category per month; fast lookup during budget check on expense creation |

> **Business rule enforced by index:** A user cannot create two budgets for the same category in the same month/year. This prevents double-budget conflicts and is enforced at the database level, not just application level.

### Sample Document

```json
{
  "_id": "64f1d5e6f7a8b9c0d4e5f6a7",
  "user": "64f1a2b3c4d5e6f7a8b9c0d1",
  "category": "64f1c4d5e6f7a8b9c0d3e4f5",
  "amount": 5000,
  "month": 1,
  "year": 2025,
  "spent": 3200,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-20T08:15:00.000Z",
  "remaining": 1800,
  "percentUsed": 64
}
```

---

## Collection 5 — Notifications

**Model file:** `backend/src/models/Notification.model.js`
**Mongoose model name:** `Notification`
**MongoDB collection:** `notifications`

### Fields

| Field | Mongoose Type | JS Type | Required | Default | Constraints |
|---|---|---|---|---|---|
| `_id` | `ObjectId` | — | Auto | — | MongoDB primary key |
| `user` | `ObjectId` | ref → `User` | ✅ Yes | — | Foreign key |
| `title` | `String` | string | ✅ Yes | — | `trim: true`, `maxlength: 100` |
| `message` | `String` | string | ✅ Yes | — | `trim: true`, `maxlength: 500` |
| `type` | `String` | string | ✅ Yes | — | `enum: ["budget_alert", "budget_exceeded", "expense_reminder", "report_ready", "system"]` |
| `severity` | `String` | string | No | `"info"` | `enum: ["info", "warning", "critical"]` |
| `isRead` | `Boolean` | boolean | No | `false` | Read/unread toggle |
| `readAt` | `Date` | Date | No | `null` | Timestamp set when `isRead` flips to `true` |
| `relatedResource.resourceType` | `String` | string | No | `null` | `enum: ["Budget", "Expense", "Category"]` — which collection triggered this |
| `relatedResource.resourceId` | `ObjectId` | — | No | `null` | `_id` of the triggering document |
| `scheduledAt` | `Date` | Date | No | `null` | Future delivery timestamp for scheduled notifications |
| `expiresAt` | `Date` | Date | No | `null` | TTL — MongoDB auto-deletes document after this date |
| `createdAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |
| `updatedAt` | `Date` | Date | Auto | — | Added by `timestamps: true` |

### Indexes

| Index Name | Fields | Type | Purpose |
|---|---|---|---|
| `user_1_isRead_1` | `{ user: 1, isRead: 1 }` | **Compound** | Fetch unread notifications for a user (notification badge count) |
| `user_1_createdAt_-1` | `{ user: 1, createdAt: -1 }` | **Compound** | Notification feed — latest first per user |
| `expiresAt_1` | `{ expiresAt: 1 }` | **TTL** | MongoDB auto-deletes documents once `expiresAt` is reached (`expireAfterSeconds: 0`) |

### Sample Document

```json
{
  "_id": "64f1e6f7a8b9c0d5e6f7a8b9",
  "user": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Budget Alert — Groceries",
  "message": "You have used 90% of your Groceries budget for January 2025.",
  "type": "budget_alert",
  "severity": "warning",
  "isRead": false,
  "readAt": null,
  "relatedResource": {
    "resourceType": "Budget",
    "resourceId": "64f1d5e6f7a8b9c0d4e5f6a7"
  },
  "scheduledAt": null,
  "expiresAt": "2025-02-01T00:00:00.000Z",
  "createdAt": "2025-01-20T08:15:00.000Z",
  "updatedAt": "2025-01-20T08:15:00.000Z"
}
```

---

## Index Master Reference

> All indexes across every collection in one place. Use this as your MongoDB Atlas index creation checklist.

| Collection | Index Fields | Type | Unique | Purpose |
|---|---|---|---|---|
| `users` | `{ email: 1 }` | Single field | ✅ Yes | Fast login lookup, duplicate account prevention |
| `expenses` | `{ user: 1, date: -1 }` | Compound | No | Transaction list sorted by date (primary dashboard query) |
| `expenses` | `{ user: 1, category: 1 }` | Compound | No | Category-filtered expense queries & breakdowns |
| `expenses` | `{ user: 1, type: 1, date: -1 }` | Compound | No | Income vs expense time-series (cash flow charts) |
| `categories` | `{ user: 1, name: 1 }` | Compound | ✅ Yes | Duplicate category name prevention per user |
| `budgets` | `{ user: 1, category: 1, month: 1, year: 1 }` | Compound | ✅ Yes | One budget per category per month enforcement |
| `notifications` | `{ user: 1, isRead: 1 }` | Compound | No | Unread notification count & filtering |
| `notifications` | `{ user: 1, createdAt: -1 }` | Compound | No | Notification feed (latest first) |
| `notifications` | `{ expiresAt: 1 }` | TTL | No | Auto-delete expired notifications |

### Index Direction Guide

| Value | Meaning | Use When |
|---|---|---|
| `1` | Ascending | Filtering, equality checks, lowest-first sorting |
| `-1` | Descending | Latest-first sorting (date feeds, timestamps) |

---

## Relationships & ERD

```
┌─────────────────────────────────────────────────────────────────────┐
│                          EXPENSEIQ DATABASE                         │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐
  │    USERS     │  ← Central entity. All others belong to a user.
  │─────────────│
  │ _id (PK)    │
  │ name        │
  │ email       │◄── UNIQUE INDEX
  │ password    │
  │ currency    │
  │ avatar      │
  └──────┬───────┘
         │ user._id referenced by ↓
         │
   ┌─────┴──────────────────────────────────────────┐
   │                                                 │
   ▼                                                 ▼
┌──────────────┐   category._id    ┌──────────────────┐
│  CATEGORIES  │◄──────────────────│    EXPENSES      │
│──────────────│                   │──────────────────│
│ _id (PK)     │                   │ _id (PK)         │
│ user (FK)    │                   │ user (FK)        │
│ name         │                   │ title            │
│ icon         │                   │ amount           │
│ color        │                   │ type             │
│ type         │                   │ category (FK)    │
└──────┬───────┘                   │ date             │◄── INDEX (user+date)
       │                           │ paymentMethod    │◄── INDEX (user+category)
       │ category._id              │ tags             │◄── INDEX (user+type+date)
       │ referenced by ↓           │ isRecurring      │
       ▼                           └──────────────────┘
┌──────────────┐
│   BUDGETS    │
│──────────────│
│ _id (PK)     │
│ user (FK)    │
│ category(FK) │◄── UNIQUE INDEX (user+category+month+year)
│ amount       │
│ month        │
│ year         │
│ spent        │
│ ~remaining   │  ← virtual
│ ~percentUsed │  ← virtual
└──────────────┘

┌──────────────────┐
│  NOTIFICATIONS   │  ← Loosely coupled; references any collection via relatedResource
│──────────────────│
│ _id (PK)         │
│ user (FK)        │
│ title            │
│ message          │
│ type             │
│ severity         │
│ isRead           │◄── INDEX (user+isRead)
│ relatedResource  │    { resourceType, resourceId }
│ expiresAt        │◄── TTL INDEX
└──────────────────┘

  Legend:
  (PK) = Primary Key     (FK) = Foreign Key
  ◄── = Index applied    ~ = Virtual field (not stored)
```

### Relationship Summary

| Relationship | Type | Via |
|---|---|---|
| User → Expenses | One-to-Many | `expense.user` |
| User → Categories | One-to-Many | `category.user` |
| User → Budgets | One-to-Many | `budget.user` |
| User → Notifications | One-to-Many | `notification.user` |
| Category → Expenses | One-to-Many | `expense.category` |
| Category → Budgets | One-to-Many | `budget.category` |
| Budget → Notification | Loose ref | `notification.relatedResource` |

---

## Mongoose Schema Code Reference

Quick copy-paste index declarations for each model:

### User.model.js
```js
userSchema.index({ email: 1 }); // unique enforced via field definition
```

### Expense.model.js
```js
expenseSchema.index({ user: 1, date: -1 });           // primary list query
expenseSchema.index({ user: 1, category: 1 });         // category filter
expenseSchema.index({ user: 1, type: 1, date: -1 });  // income vs expense
```

### Category.model.js
```js
categorySchema.index({ user: 1, name: 1 }, { unique: true }); // no duplicate names per user
```

### Budget.model.js
```js
budgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true } // one budget per category per month
);
```

### Notification.model.js
```js
notificationSchema.index({ user: 1, isRead: 1 });           // unread badge
notificationSchema.index({ user: 1, createdAt: -1 });        // feed order
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL
```

---

*Last updated: Phase 1 — Foundation & Setup | ExpenseIQ v1.0*
