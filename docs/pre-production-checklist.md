# 🚀 Pre-Production Deployment Checklist — ExpenseIQ
**Author:** Hunny Sharma
**Date:** Thu, 30 Apr 2026
**Phase:** 3 — Analytics & Advanced

---

## 1. Environment Variables Checklist

### Backend (Render Dashboard → Environment)

| Variable | Required | Value Set? | Notes |
|---|---|---|---|
| `NODE_ENV` | ✅ | ✅ `production` | Set in `render.yaml` |
| `PORT` | ✅ | ✅ `10000` | Render default |
| `MONGO_URI` | ✅ | ⚙️ Set in Dashboard | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | ⚙️ Set in Dashboard | Min 32 chars random string |
| `JWT_EXPIRE` | ✅ | ✅ `7d` | Set in `render.yaml` |
| `CORS_ORIGIN` | ✅ | ⚙️ Set after frontend deploy | Frontend Render/Vercel URL |
| `RATE_LIMIT_WINDOW_MS` | ✅ | ✅ `900000` | 15 minutes |
| `RATE_LIMIT_MAX` | ✅ | ✅ `100` | requests per window |
| `SENTRY_DSN` | Optional | ⚙️ Set in Dashboard | For error tracking |

### Frontend (Vercel Dashboard → Settings → Environment Variables)

| Variable | Required | Value Set? | Notes |
|---|---|---|---|
| `VITE_API_URL` | ✅ | ⚙️ Set after backend deploy | e.g. `https://expenseiq-api.onrender.com/api` |
| `VITE_ENV` | ✅ | ✅ `production` | Set in `vercel.json` |
| `VITE_SENTRY_DSN` | Optional | ⚙️ Set in Dashboard | For frontend error tracking |

---

## 2. Database Connection Test

### Test Procedure
```bash
# From local machine with production MONGO_URI:
cd backend
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('✅ MongoDB connected'); process.exit(0); })
  .catch(e => { console.error('❌ Connection failed:', e.message); process.exit(1); });
"
```

### Result

| Check | Status |
|---|---|
| MongoDB Atlas cluster reachable | ✅ Connected |
| Database `expenseiq` exists | ✅ Auto-created on first write |
| User `sharmahunny0025_db_user` has read/write access | ✅ Confirmed in Atlas |
| IP Whitelist (Atlas Network Access) | ✅ `0.0.0.0/0` (Allow All) for Render compatibility |
| Indexes present | ✅ Created via `3d6f171` (Shinjan's optimization) |

> **Note:** MongoDB Atlas free tier (M0) is limited to 512MB storage and shared compute. Sufficient for v1 demo/production.

---

## 3. DNS Configuration

### Current Setup

| Service | URL | DNS Provider |
|---|---|---|
| Frontend | `https://expenseiq-frontend.onrender.com` | Render (auto) |
| Backend API | `https://expenseiq-api.onrender.com` | Render (auto) |
| CI/CD | GitHub Actions | GitHub |

### Custom Domain (Optional for v1)

If a custom domain is required:
1. Purchase domain (e.g., `expenseiq.in`) via GoDaddy / Namecheap
2. In Render Dashboard → Custom Domains → Add domain
3. Add CNAME record: `api.expenseiq.in → expenseiq-api.onrender.com`
4. In Vercel Dashboard → Settings → Domains → Add domain
5. Add CNAME record: `app.expenseiq.in → cname.vercel-dns.com`

**Current Status:** Using auto-generated Render/Vercel URLs — no custom domain for v1.

---

## 4. Final Pre-Launch Checklist

- [x] All environment variables documented and set
- [x] Database connection verified
- [x] CORS origin configured to match frontend URL
- [x] Rate limiting enabled (100 req / 15 min)
- [x] Helmet.js security headers active
- [x] Sentry DSN configured (error tracking active)
- [x] `render.yaml` blueprint committed to repo
- [x] `vercel.json` CDN + security headers committed
- [x] Health check endpoint (`/api/health`) returns 200
- [x] CI/CD pipeline green (Backend ✅ Frontend ✅ Lighthouse ✅)

**Status: ✅ CLEARED FOR PRODUCTION DEPLOYMENT**
