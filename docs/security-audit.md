# 🔐 Security Audit Report — ExpenseIQ
**Auditor:** Hunny Sharma
**Date:** Wed, 29 Apr 2026
**Phase:** 3 — Analytics & Advanced
**Scope:** Backend API security, exposed secrets, CORS, JWT, rate limiting

---

## 1. Exposed `.env` Keys Scan

### Method
Scanned entire repository using `git grep` for common secret patterns:
```bash
git grep -i "password\|secret\|api_key\|token\|mongo_uri\|dsn" -- "*.js" "*.ts" "*.json" "*.env"
```

### Findings

| File | Finding | Status |
|---|---|---|
| `backend/.env.example` | Contains placeholder keys only (`YOUR_SECRET_HERE`) | ✅ Safe |
| `frontend/.env.example` | Contains placeholder `VITE_API_URL` only | ✅ Safe |
| `backend/src/sentry.js` | DSN read from `process.env.SENTRY_DSN` — no hardcoding | ✅ Safe |
| `backend/src/config/db.js` | MONGO_URI read from `process.env.MONGO_URI` — no hardcoding | ✅ Safe |
| `.gitignore` | `.env` files properly ignored | ✅ Safe |
| `render.yaml` | Secrets use `sync: false` — NOT committed to repo | ✅ Safe |
| `frontend/vercel.json` | No secrets present — only `VITE_API_URL` (public) | ✅ Safe |

**Result: No hardcoded secrets found in any committed file. ✅**

---

## 2. CORS Configuration Validation

### Config (from `backend/src/server.js`)
```js
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];
```

### Findings

| Check | Result |
|---|---|
| Wildcard `*` origin allowed | ❌ Not present — origin whitelist used |
| Production origin configurable via env | ✅ `CORS_ORIGIN` env var |
| Credentials enabled | ✅ `credentials: true` |
| Unknown origins rejected | ✅ Returns CORS error |
| Multiple origins supported (comma-separated) | ✅ `.split(',')` |

**Action Required:** Ensure `CORS_ORIGIN=https://expenseiq-frontend.onrender.com` is set in Render dashboard before production launch.

**Result: CORS configuration is secure. ✅**

---

## 3. JWT Expiry Settings

### Config (from `backend/.env.example` and auth routes)
```
JWT_SECRET=<set in Render dashboard>
JWT_EXPIRE=7d
```

### Findings

| Check | Result |
|---|---|
| JWT_SECRET is environment-injected | ✅ Never hardcoded |
| Token expiry set | ✅ 7 days (appropriate for web app) |
| Refresh token mechanism | ⚠️ Not implemented — acceptable for v1 |
| Token stored in `httpOnly` cookie or Authorization header | ✅ Authorization header (`Bearer`) |
| Token verified on all protected routes | ✅ Auth middleware applied |
| JWT algorithm | ✅ HS256 (default, acceptable) |

**Recommendation:** For v2, implement refresh tokens to avoid long-lived sessions. For now, 7-day expiry with login-on-expiry is acceptable.

**Result: JWT configuration is secure for v1. ✅**

---

## 4. API Rate Limiting Review

### Config (from `backend/src/server.js`)
```js
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);
```

### Findings

| Check | Result |
|---|---|
| Rate limiter applied to all `/api` routes | ✅ |
| Window: 15 minutes, Max: 100 requests | ✅ Reasonable defaults |
| Configurable via env (RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS) | ✅ |
| Auth routes have stricter limits | ⚠️ Same as global — recommended to tighten |
| Helmet security headers applied | ✅ `app.use(helmet())` |

**Recommendation:** Apply stricter rate limiting on `/api/auth/login` to prevent brute-force:
```js
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/api/auth', authLimiter);
```
This is a **non-blocking recommendation** for v1 hardening.

**Result: Rate limiting is functional and acceptable for production. ✅**

---

## 5. Additional Security Checks

| Check | Status | Notes |
|---|---|---|
| Helmet.js applied | ✅ | Sets X-Frame-Options, X-Content-Type-Options, etc. |
| Input validation (Joi) | ✅ | Added by Shinjan — validates all request bodies |
| Future date rejection on expenses | ✅ | Added by Shinjan (`fix: reject future dates`) |
| MongoDB injection protection | ✅ | Mongoose sanitizes queries by default |
| Password hashing | ✅ | bcrypt used in User model |
| No `console.log` of secrets | ✅ | Verified via grep |

---

## Summary

| Category | Status |
|---|---|
| Exposed .env keys | ✅ PASS |
| CORS configuration | ✅ PASS |
| JWT settings | ✅ PASS |
| Rate limiting | ✅ PASS (recommendation for auth routes) |
| Overall | ✅ **CLEARED FOR PRODUCTION** |
