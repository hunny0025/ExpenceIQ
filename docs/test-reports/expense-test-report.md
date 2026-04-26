# 🧪 Expense CRUD — Manual Test Report

**Tester:** Shivangi Girjesh Pandey
**Role:** Backend Support & QA
**Date:** April 26, 2026
**Tool Used:** Postman
**Base URL:** http://localhost:5000/api/expenses

---

## Test Environment
| Item | Detail |
|------|--------|
| Node.js | v20.19.6 |
| Backend | Express.js on port 5000 |
| Database | MongoDB Atlas |
| Testing Tool | Postman |

---

## Create Expense — POST /api/expenses

### TC001 — Create Valid Expense
**Input:**
```json
{
  "title": "Grocery Shopping",
  "amount": 500,
  "type": "expense",
  "date": "2026-04-23",
  "paymentMethod": "cash",
  "category": "69eded945f55908f7d01ec03"
}
```
**Expected:** Status 201, expense created with ID

**Actual:** Status 201, expense created successfully

**Result: ✅ PASS**

---

### TC002 — Create Missing Amount
**Input:** Same as TC001 without amount field

**Expected:** Status 400, "amount is required"

**Actual:** Status 400, validation error from Mongoose DB level

**Result: ⚠️ PARTIAL PASS**

**Bug Found:**
> Validation happens at DB level instead of controller level.

---

### TC003 — Create Invalid Date
**Input:** date: "invalid-date"

**Expected:** Status 400, "Please provide a valid date"

**Actual:** Status 400, technical Mongoose cast error message returned

**Result: ⚠️ PARTIAL PASS**

**Bug Found:**
> Error message too technical — exposes internal Mongoose error to user.

---

## Read Expenses — GET /api/expenses

### TC004 — Get All Expenses
**Input:** No body, valid token in header

**Expected:** Status 200, array of expenses with pagination

**Actual:** Status 200, expenses array with pagination returned

**Result: ✅ PASS**

---

### TC005 — Get Expense by ID
**Input:** GET /api/expenses/:id

**Expected:** Status 200, single expense returned

**Actual:** Status 404 — endpoint not found

**Result: ❌ FAIL**

**Bug Found:**
> GET /api/expenses/:id endpoint not implemented.
> Route only supports PUT and DELETE by ID — GET by ID is completely missing.

---

### TC006 — Get with Filters
**Input:** GET /api/expenses?type=expense

**Expected:** Status 200, filtered expenses returned

**Actual:** Status 200, correct filtered results returned

**Result: ✅ PASS**

---

## Update Expense — PUT /api/expenses/:id

### TC007 — Update Valid Expense
**Input:**
```json
{
  "amount": 750,
  "title": "Updated Grocery Shopping"
}
```
**Expected:** Status 200, updated expense returned

**Actual:** Status 200, amount updated from 500 to 750, updatedAt timestamp changed

**Result: ✅ PASS**

---

### TC008 — Update Wrong ID
**Input:** PUT /api/expenses/000000000000000000000000

**Expected:** Status 404, "Expense not found"

**Actual:** Status 404, correct error message returned

**Result: ✅ PASS**

---

## Delete Expense — DELETE /api/expenses/:id

### TC009 — Delete Valid Expense
**Input:** DELETE /api/expenses/:id with valid ID

**Expected:** Status 200, "Expense deleted successfully"

**Actual:** Status 200, expense deleted successfully

**Result: ✅ PASS**

---

### TC010 — Delete Already Deleted Expense
**Input:** Same DELETE request with already deleted ID

**Expected:** Status 404, "Expense not found"

**Actual:** Status 404, correct error returned

**Result: ✅ PASS**

---

## 🐛 Bug Report

### Bug #1 — Validation at Wrong Layer
- **Severity:** Medium
- **Endpoints:** POST /api/expenses
- **Description:** Missing field validation happens at Mongoose level not controller level
- **Impact:** Inconsistent error messages, slower response
- **Fix:** Add manual validation in controller before calling Expense.create()

### Bug #2 — Stack Trace Exposed
- **Severity:** High
- **Endpoints:** All expense endpoints
- **Description:** Full stack trace with file paths exposed in error responses
- **Impact:** Security risk — exposes internal server structure
- **Fix:** Hide stack trace in production using NODE_ENV check

### Bug #3 — Technical Error Message for Invalid Date
- **Severity:** Low
- **Endpoint:** POST /api/expenses
- **Description:** Invalid date returns raw Mongoose cast error
- **Impact:** Poor user experience, confusing message
- **Fix:** Catch date validation in controller, return friendly message

### Bug #4 — GET by ID Endpoint Missing
- **Severity:** High
- **Endpoint:** GET /api/expenses/:id
- **Description:** Route not implemented — only PUT and DELETE exist for /:id
- **Impact:** Frontend cannot fetch single expense by ID
- **Fix:** Add getExpenseById controller and GET route in expense.routes.js

---

## Test Summary

| TC | Scenario | Method | Status Code | Result |
|----|----------|--------|-------------|--------|
| TC001 | Create Valid | POST | 201 | ✅ PASS |
| TC002 | Create Missing Amount | POST | 400 | ⚠️ PARTIAL |
| TC003 | Create Invalid Date | POST | 400 | ⚠️ PARTIAL |
| TC004 | Get All Expenses | GET | 200 | ✅ PASS |
| TC005 | Get by ID | GET | 404 | ❌ FAIL |
| TC006 | Get with Filters | GET | 200 | ✅ PASS |
| TC007 | Update Valid | PUT | 200 | ✅ PASS |
| TC008 | Update Wrong ID | PUT | 404 | ✅ PASS |
| TC009 | Delete Valid | DELETE | 200 | ✅ PASS |
| TC010 | Delete Already Deleted | DELETE | 404 | ✅ PASS |

**Total: 7 Pass | 2 Partial | 1 Fail**
**Bugs Found: 4**