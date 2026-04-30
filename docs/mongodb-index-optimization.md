# MongoDB Query Optimization Report

## Current Indexes

### Expense Collection

| Index | Fields | Purpose |
|-------|--------|---------|
| `userId_1` | Single | User lookup |
| `userId_1_date_-1` | Compound | Filter by user + date sorting |
| `userId_1_category_1` | Compound | Filter by user + category |
| `_id_` | Primary | Default primary key |

### Budget Collection

| Index | Fields | Purpose |
|-------|--------|---------|
| `userId_1` | Single | User lookup |
| `userId_1_categoryId_1_month_1_year_1` | Compound (unique) | Unique budget per user/category/month/year |

### Category Collection

| Index | Fields | Purpose |
|-------|--------|---------|
| `userId_1` | Single | User lookup |
| `userId_1_name_1` | Compound (unique) | Unique category name per user |

---

## Query Analysis with explain()

### 1. Get Expenses with Pagination & Filters

```javascript
// Query pattern from getExpenses controller
db.expenses.find({ userId: ObjectId("..."), category: "abc" })
  .sort({ date: -1 })
  .skip(0)
  .limit(20)

// Run explain
db.expenses.find({ userId: ObjectId("..."), category: "abc" })
  .sort({ date: -1 })
  .explain("executionStats")
```

**Expected Index Usage**: `userId_1_category_1` or `userId_1_date_-1`

**Execution Stats to Check**:
- `executionStages.indexName` - should show compound index used
- `totalDocsExamined` - should be low (ideally close to `nReturned`)
- `executionTimeMillis` - should be < 10ms for small datasets

---

### 2. Date Range Query with User Filter

```javascript
// Query pattern for date filtering
db.expenses.find({
  userId: ObjectId("..."),
  date: { $gte: ISODate("2026-04-01"), $lte: ISODate("2026-04-30") }
}).explain("executionStats")
```

**Expected Index Usage**: `userId_1_date_-1`

---

### 3. Budget Spent Calculation (Aggregation)

```javascript
// From budget controller - aggregation for spent amounts
db.expenses.aggregate([
  {
    $match: {
      userId: ObjectId("..."),
      category: { $in: [ObjectId("..."), ...] },
      date: { $gte: ISODate("..."), $lte: ISODate("...") }
    }
  },
  {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" }
    }
  }
]).explain("executionStats")
```

**Expected Index Usage**: Compound index on `(userId, category, date)` would help

---

### 4. Text Search on Description/Tags

```javascript
// Current implementation uses regex (slow)
db.expenses.find({
  userId: ObjectId("..."),
  $or: [
    { description: { $regex: "lunch", $options: "i" } },
    { tags: { $regex: "food", $options: "i" } }
  ]
}).explain("executionStats")
```

**Issue**: Regex queries cannot use indexes efficiently

**Recommendation**: Consider text index for description field

---

## Recommended Additional Indexes

### 1. Compound Index for Budget Aggregation

```javascript
// Helps with budget spent calculation
db.expenses.createIndex(
  { userId: 1, category: 1, date: 1 },
  { name: "user_category_date_idx" }
)
```

### 2. Text Index for Search (Optional)

```javascript
// For better text search performance
db.expenses.createIndex(
  { description: "text", tags: "text" },
  { name: "text_search_idx" }
)
```

Note: Text indexes have write overhead - use only if search is frequent.

---

## How to Run explain() in MongoDB Shell

```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/expenceiq"

# Run explain on specific queries
db.expenses.find({ userId: ObjectId("USER_ID_HERE") })
  .sort({ date: -1 })
  .limit(20)
  .explain("executionStats")

# Check all indexes on a collection
db.expenses.getIndexes()

# Check index usage for a query
db.expenses.find({ userId: ObjectId("USER_ID"), date: { $gte: new Date("2026-01-01") } })
  .explain("queryPlanner")
```

---

## Performance Checklist

- [ ] `totalDocsExamined` should be close to `nReturned` (high efficiency)
- [ ] `executionTimeMillis` should be < 10ms for typical queries
- [ ] Avoid COLSCAN - should always use ixscan with indexed fields
- [ ] Compound indexes should match query filter + sort order

---

## Known Issues Found

### Analytics Controller Bug

The `analytics.controller.js` uses non-existent fields:

| Query Field | Actual Field | Issue |
|-------------|--------------|-------|
| `user` | `userId` | Wrong field name |
| `type: 'expense'` | Not in schema | Field doesn't exist |
| `paymentMethod` | Not in schema | Field doesn't exist |

**Impact**: Analytics endpoint will return empty results or errors.

**Fix Required**: Update analytics controller to use correct field names matching the Expense model schema.