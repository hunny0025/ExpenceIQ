# Task 7 — Expense Edge Case Test Report

**Project:** ExpenseIQ  
**Endpoint:** `POST /api/expenses`  
**Tool Used:** Postman  
---

## Summary

| # | Test Case | Status |
|---|-----------|--------|
| 1 | Negative Amount | ✅ Pass |
| 2 | Future Date | ❌ Bug Found |
| 3 | Long Description (500 chars) | ✅ Pass |
| 4 | Empty Category | ✅ Pass |

**Total Tests:** 4 | **Passed:** 3 | **Failed:** 1 | **Bugs Found:** 1

---

## Test Cases

### TC-01 — Negative Amount

**Input:**
```json
{
  "amount": -500,
  "date": "2025-04-30",
  "description": "test",
  "category": "<valid_category_id>"
}
```

**Expected:** `400 Bad Request` with validation error  
**Actual:** `400 Bad Request` — `"amount must be a positive number"`  
**Result:** ✅ Pass  
**Notes:** Validation handled at controller level correctly.

---

### TC-02 — Future Date

**Input:**
```json
{
  "amount": 100,
  "date": "2099-12-31",
  "description": "test",
  "category": "<valid_category_id>"
}
```

**Expected:** `400 Bad Request` — date cannot be in the future  
**Actual:** `200 OK` — expense created with future date `2099-12-31T00:00:00.000Z`  
**Result:** ❌ Fail — Bug Found

---

### TC-03 — Long Description (500+ chars)

**Input:**
```json
{
  "amount": 100,
  "date": "2025-04-30",
  "description": "aaa...(502 characters)",
  "category": "<valid_category_id>"
}
```

**Expected:** `400 Bad Request` with character limit error  
**Actual:** `400 Bad Request` — `"description length must be less than or equal to 500 characters long"`  
**Result:** ✅ Pass  
**Notes:** 500 character limit enforced correctly.

---

### TC-04 — Empty Category

**Input:**
```json
{
  "amount": 100,
  "date": "2025-04-30",
  "description": "test",
  "category": ""
}
```

**Expected:** `400 Bad Request` with required field error  
**Actual:** `400 Bad Request` — `"category is not allowed to be empty"`  
**Result:** ✅ Pass

---

## Bug Report

### BUG-01 — Future Date Accepted in Expense Creation

| Field | Details |
|-------|---------|
| **Endpoint** | `POST /api/expenses` |
| **Field** | `date` |
| **Input** | `2099-12-31` |
| **Expected** | `400 Bad Request` — reject future dates |
| **Actual** | `200 OK` — expense created successfully |
| **Severity** | Medium |
| **Priority** | Medium |
| **Status** | Open |

**Description:**  
The expense creation endpoint does not validate whether the provided date is in the future. A user can create an expense with a date of `2099-12-31` and it gets saved to the database successfully. This can lead to incorrect financial data, wrong analytics, and budget miscalculations for future months.

**Suggested Fix:**  
Add a date validation check in the expense controller to reject any date greater than today's date.

```javascript
if (new Date(date) > new Date()) {
  return res.status(400).json({ message: "Date cannot be in the future" });
}
```

---

## Validation Behavior Summary

| Field | Validation Exists | Level | Notes |
|-------|------------------|-------|-------|
| amount | ✅ Yes | Controller | Rejects negative values |
| date | ❌ No | — | Future dates accepted — Bug |
| description | ✅ Yes | Controller | 500 char limit enforced |
| category | ✅ Yes | Controller | Empty value rejected |
