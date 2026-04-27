# Budget Endpoints - Manual Test Report

**Tester:** Shivangi Girjesh Pandey
**Role:** Backend Support & QA
**Date:** April,2026
**Tool Used:** Postman
**Base URL:** http://localhost:5000/api/budgets

## Test Environment
| Item | Detail |
|------|--------|
| Node.js | v20.19.6 |
| Backend | Express.js on port 5000 |
| Database | MongoDB Atlas |
| Testing Tool | Postman |

## TC-1 - Set Budget
**Input:**
```json
{
  "categoryId": "69eded945f55908f7d01ec03",
  "amount": 1000,
  "month": 4,
  "year": 2026
}
```
**Expected:** Status 200, budget created with spent, remaining and percentUsed fields

**Actual:** Status 200, budget created successfully with all fields

**Result: PASS**

## TC-2 - Get Budget for Month
**Input:** GET /api/budgets?month=4&year=2026

**Expected:** Status 200, budget data for April 2026 returned

**Actual:** Status 200, correct budget returned with count, amount, spent, remaining, percentUsed

**Result: PASS**

## TC-3 - Update Budget
**Input:**
```json
{
  "amount": 1500
}
```
**Expected:** Status 200, amount updated, remaining recalculated

**Actual:** Status 200, amount updated from 1000 to 1500, remaining and updatedAt changed correctly

**Result: PASS**

## TC-4 - Exceed Budget Scenario
**Input:** Created 2 expenses of 1000 each for Food category in April 2026, total spent 2000 against budget of 1500

**Expected:** spent shows 2000, remaining shows -500, percentUsed shows 100

**Actual:** spent shows 0, remaining shows 1500, percentUsed shows 0 - expenses not being counted

**Result: FAIL

## Bug Report

### Bug - Budget Spent Calculation Broken
**Severity:** Critical
**Endpoint:** GET /api/budgets
**Description:** Budget controller calculates spent amount by matching expenses using category name. However expenses store category as an ObjectId not a name. Because of this mismatch the aggregation query never finds any matching expenses and spent always returns 0.

**Root Cause:**
Controller collects category names like this:
const categoryNames = budgets.map(b => b.categoryId.name);

Then searches expenses using:
category: { $in: categoryNames }

But expenses store category as ObjectId like 69eded945f55908f7d01ec03 not as string "Food". These will never match.

**Impact:**
- spent always returns 0
- remaining always equals full budget amount
- percentUsed always stays 0
- Exceed budget scenario cannot work
- Frontend budget progress bars will always show empty

**Fix Suggested:** Match expenses by categoryId ObjectId instead of category name in the aggregation pipeline.

## Test Summary
| TC | Scenario | Method | Status Code | Result |
|----|----------|--------|-------------|--------|
| TC001 | Set Budget | POST | 200 | PASS |
| TC002 | Get Budget for Month | GET | 200 | PASS |
| TC003 | Update Budget | PUT | 200 | PASS |
| TC004 | Exceed Budget Scenario | GET | 200 | FAIL |

**Total: 3 Pass | 1 Fail**
**Bugs Found: 1 Critical**