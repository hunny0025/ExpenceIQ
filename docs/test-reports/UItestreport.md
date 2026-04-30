# Frontend UI Test Report

**Tester:** Shivangi Girjesh Pandey
**Tool Used:** Browser + Browser Console
**Base URL:** http://localhost:5173

## Test Environment
| Item | Detail |
|------|--------|
| Frontend | React + Vite on port 5173 |
| Backend | Express.js on port 5000 |
| Browser | Chrome |

## Login Page

**Pass:** Create account link works
**Pass:** Password show/hide works
**Pass:** Remember me works
**Pass:** Wrong credentials shows error message
**Pass:** Valid login redirects to Dashboard correctly

**UI Issue 1 - Forgot Password not working**
Clicking "Forgot password?" does nothing. Either link is broken or feature not implemented yet. 

## Dashboard Page

**Pass:** Username "Hey, Shivangi!" showing correctly
**Pass:** Sidebar navigation visible - Dashboard, Expenses, Budget, Analytics
**Pass:** Sign Out button visible
**Pass:** Add Expense button visible

**UI Issue 2 - Filters button not working**
Clicking Filters on dashboard does nothing. Feature not implemented yet.

**UI Issue 3 - Search bar not working**
Search bar visible but typing does nothing. Not connected to API yet.

**UI Issue 4 - Add Expense button not working**
Clicking Add Expense does nothing. Form/modal not implemented yet.

**UI Issue 5 - Set New Goal button not working**
Clicking Set New Goal does nothing. Feature not implemented yet.

## Expenses Page

**Pass:** Expense list loads and displays correctly
**Pass:** Category filter buttons work
**Pass:** New Expense button opens modal
**Pass:** Add Expense successfully adds expense
**Pass:** Delete action works

**UI Issue 6 - Edit icon not working**
Clicking edit/pencil icon on expense does nothing. Feature not implemented yet.

**UI Issue 7 - Category dropdown not fully visible**
When selecting category in Add New Expense modal, dropdown opens but only shows "Food". Rest of dropdown content area is white/empty and cuts off. Possible overflow or z-index CSS issue.

**UI Issue 8 - Receipt upload not working**
"Click or drag to upload receipt" does nothing. Feature not implemented yet.

## Budget Page

**Pass:** Budget page loads correctly
**Pass:** Existing budgets visible

**UI Issue 9 - Add Budget button not working**
Clicking Add Budget does nothing. Feature not implemented yet.

**UI Issue 10 - Edit button on budgets not working**
Clicking edit on existing budgets does nothing. Feature not implemented yet.

## Analytics Page

**Pass:** Page loads correctly
**Pass:** Stats cards visible - Monthly Savings, Highest Spend, Daily Avg
**Pass:** Spending Insights section visible

**UI Issue 11 - Cash Flow Trend chart empty**
Chart area is completely blank. No data being rendered. Not connected to real API yet.

**UI Issue 12 - Weekly Activity chart empty**
Weekly spending per day chart area is completely blank.

**UI Issue 13 - Filter button not working**
Clicking button does nothing.

**UI Issue 14 - Hardcoded sample data**
Dashboard, Expenses and Analytics pages display hardcoded sample data not real API data. Real API integration pending as per project timeline Days 3-7.

## Test Summary
| Page | Status | Issues Found |
|------|--------|--------------|
| Login | PASS | 1 |
| Dashboard | PARTIAL | 4 |
| Expenses | PARTIAL | 3 |
| Budget | PARTIAL | 2 |
| Analytics | PARTIAL | 5 |

**Total UI Issues Found: 14**
