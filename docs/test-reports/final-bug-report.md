# ExpenseIQ — Final Bug Report

**Project:** ExpenseIQ  
**QA By:** Shivangi Pandey  
**Date:** 2026-04-30  
**Total Bugs Found:** 7 | **Fixed:** 5 | **Open:** 2  

---

## Bug Summary Table

| Bug ID | Module | Page/Endpoint | Description | Severity | Status |
|--------|--------|---------------|-------------|----------|--------|
| BUG-01 | Backend | POST /api/auth/register | Validation at DB level not controller level | P2 | ✅ Fixed |
| BUG-02 | Backend | All error responses | Stack trace exposed in error responses | P1 | ✅ Fixed |
| BUG-03 | Backend | POST /api/expenses | Invalid date shows technical Mongoose error | P2 | ✅ Fixed |
| BUG-04 | Backend | GET /api/expenses/:id | GET by ID endpoint completely missing | P1 | ✅ Fixed |
| BUG-05 | Backend | POST /api/expenses | Future date accepted without validation | P2 | ✅ Fixed |
| BUG-06 | Backend | GET /api/budgets | Budget spent always shows 0 — category mismatch | P1 | ❌ Open |
| BUG-07 | Frontend | All Pages | Sidebar not responsive on iPhone SE (375px) | P2 | ❌ Open |

---

## Detailed Bug Reports

### BUG-01 — Validation at DB Level (Auth)
| Field | Details |
|-------|---------|
| **Module** | Backend — Auth |
| **Endpoint** | POST /api/auth/register |
| **Severity** | P2 |
| **Status** | ✅ Fixed |
| **Steps to Reproduce** | Send register request with only email field, no name or password |
| **Expected** | 400 — "name is required", "password is required" from controller |
| **Actual (Before Fix)** | 400 — "User already exists" — checked DB before validating fields |
| **After Fix** | 400 — correct field-level validation messages from controller |

---

### BUG-02 — Stack Trace Exposed in Error Responses
| Field | Details |
|-------|---------|
| **Module** | Backend — All |
| **Endpoint** | All error responses |
| **Severity** | P1 |
| **Status** | ✅ Fixed |
| **Steps to Reproduce** | Send any invalid request and check response body |
| **Expected** | Clean error message only |
| **Actual (Before Fix)** | Full stack trace visible in response — security risk |
| **After Fix** | Clean error responses, no stack trace |

---

### BUG-03 — Technical Error Message for Invalid Date
| Field | Details |
|-------|---------|
| **Module** | Backend — Expenses |
| **Endpoint** | POST /api/expenses |
| **Severity** | P2 |
| **Status** | ✅ Fixed |
| **Steps to Reproduce** | Send `"date": "not-a-date"` in request body |
| **Expected** | "Please provide a valid date" |
| **Actual (Before Fix)** | Raw Mongoose cast error exposed |
| **After Fix** | "date must be in ISO 8601 date format" |

---

### BUG-04 — GET Expense by ID Endpoint Missing
| Field | Details |
|-------|---------|
| **Module** | Backend — Expenses |
| **Endpoint** | GET /api/expenses/:id |
| **Severity** | P1 |
| **Status** | ✅ Fixed |
| **Steps to Reproduce** | Send GET request to /api/expenses/<valid_id> |
| **Expected** | 200 — expense data returned |
| **Actual (Before Fix)** | Route not found — endpoint not implemented |
| **After Fix** | 200 — expense data returned correctly |

---

### BUG-05 — Future Date Accepted in Expense Creation
| Field | Details |
|-------|---------|
| **Module** | Backend — Expenses |
| **Endpoint** | POST /api/expenses |
| **Severity** | P2 |
| **Status** | ✅ Fixed |
| **Steps to Reproduce** | Send `"date": "2099-12-31"` in create expense request |
| **Expected** | 400 — "date cannot be in the future" |
| **Actual (Before Fix)** | 200 — expense created with future date |
| **After Fix** | 400 — "date cannot be in the future" |

---

### BUG-06 — Budget Spent Always Shows 0 ❌ OPEN
| Field | Details |
|-------|---------|
| **Module** | Backend — Budget |
| **Endpoint** | GET /api/budgets |
| **Severity** | P1 |
| **Status** | ❌ Open |
| **Steps to Reproduce** | 1. Set budget for Food category. 2. Create expenses with Food category. 3. GET budget for current month. 4. Check spent field |
| **Expected** | spent shows sum of Food expenses |
| **Actual** | spent always shows 0 |
| **Root Cause** | Budget controller matches expenses using category name string but expenses store category as ObjectId — permanent mismatch |
| **Suggested Fix** | Match by category ObjectId instead of name: `category: { $in: categoryIds }` |

---

### BUG-07 — Sidebar Not Responsive on Mobile ❌ OPEN
| Field | Details |
|-------|---------|
| **Module** | Frontend |
| **Endpoint** | All Pages |
| **Severity** | P2 |
| **Status** | ❌ Open |
| **Steps to Reproduce** | 1. Open app in Chrome. 2. Open DevTools (F12). 3. Set device to iPhone SE (375px). 4. Navigate to any page |
| **Expected** | Sidebar collapses, hamburger menu icon shown |
| **Actual** | Sidebar stays open, overlaps main content, content cut off on right |
| **Assign To** | Mehul (Frontend Developer) |

---

## Open Issues — Action Required

| Bug ID | Description | Assigned To | Priority |
|--------|-------------|-------------|----------|
| BUG-06 | Budget spent always 0 | Shinjan (Backend) | P1 |
| BUG-07 | Sidebar not responsive on mobile | Mehul (Frontend) | P2 |

---

## Additional UI Issues (Not Bugs — Features Pending Implementation)

| # | Page | Issue |
|---|------|-------|
| UI-01 | Login | Forgot Password link not working |
| UI-02 | Dashboard | Filters button not working |
| UI-03 | Dashboard | Search bar not connected to API |
| UI-04 | Dashboard | Add Expense button not working |
| UI-05 | Dashboard | Set New Goal button not working |
| UI-06 | Expenses | Edit icon not working |
| UI-07 | Expenses | Category dropdown cuts off |
| UI-08 | Expenses | Receipt upload not working |
| UI-09 | Budget | Add Budget button not working |
| UI-10 | Budget | Edit button on budgets not working |
| UI-11 | Analytics | Cash Flow Trend chart empty |
| UI-12 | Analytics | Weekly Activity chart empty |
| UI-13 | Analytics | Last 6 Months filter not working |
| UI-14 | All | Hardcoded sample data — real API integration pending |
