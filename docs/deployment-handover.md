# 📦 Deployment Handover Document — ExpenseIQ
**Author:** Hunny Sharma (Web Dev — DevOps Lead)
**Date:** Sat, 02 May 2026
**Phase:** 4 — Polish & Deploy
**Version:** 1.0.0

---

## 1. Project Overview

**ExpenseIQ** is a production-grade full-stack expense management platform. It enables users to track spending, manage budgets, visualize analytics, and generate reports.

| Property | Value |
|---|---|
| Repository | https://github.com/hunny0025/ExpenceIQ |
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express + MongoDB |
| CI/CD | GitHub Actions |
| Frontend Hosting | Vercel / Render (Static) |
| Backend Hosting | Render (Web Service) |

---

## 2. Live URLs

| Service | URL | Status |
|---|---|---|
| Frontend | https://expenseiq-frontend.onrender.com | ✅ Live |
| Backend API | https://expenseiq-api.onrender.com | ✅ Live |
| Health Check | https://expenseiq-api.onrender.com/api/health | ✅ Live |
| CI/CD Pipeline | https://github.com/hunny0025/ExpenceIQ/actions | ✅ Passing |

---

## 3. Deployment Architecture

```
GitHub (main branch)
       │
       ├── GitHub Actions CI/CD
       │     ├── Backend — Lint & Test  ✅
       │     ├── Frontend — Lint & Build ✅
       │     └── Lighthouse Audit        ✅ (informational)
       │
       ├── Render (Auto-deploy on push to main)
       │     └── expenseiq-api  [Node.js Web Service]
       │           ├── Root Dir: /backend
       │           ├── Start: node src/server.js
       │           ├── Health: GET /api/health
       │           └── Region: Singapore
       │
       └── Vercel / Render Static
             └── expenseiq-frontend  [React SPA]
                   ├── Build: npm run build
                   ├── Dist: /frontend/dist
                   └── SPA Rewrite: /* → /index.html
```

---

## 4. Environment Variables

### Backend (Set in Render Dashboard)

| Variable | Description |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random string (min 32 chars) |
| `JWT_EXPIRE` | `7d` |
| `CORS_ORIGIN` | Frontend URL (comma-separated for multiple) |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15 minutes) |
| `RATE_LIMIT_MAX` | `100` |
| `SENTRY_DSN` | Sentry DSN for error tracking (optional) |

### Frontend (Set in Vercel/Render Dashboard)

| Variable | Description |
|---|---|
| `VITE_API_URL` | `https://expenseiq-api.onrender.com/api` |
| `VITE_ENV` | `production` |
| `VITE_SENTRY_DSN` | Sentry DSN for frontend (optional) |

---

## 5. Deployment Steps

### Fresh Deployment

**Backend (Render):**
1. Go to https://dashboard.render.com → New → Blueprint
2. Connect `hunny0025/ExpenceIQ` repository
3. Render detects `render.yaml` automatically
4. Add secrets in Dashboard → Environment
5. Click "Apply" — service starts in ~3 minutes

**Frontend (Vercel):**
1. Go to https://vercel.com/new
2. Import `hunny0025/ExpenceIQ` repository
3. Set Root Directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://expenseiq-api.onrender.com/api`
5. Deploy — live in ~2 minutes

### Update Deployment (Auto)
Every push to `main` triggers:
- GitHub Actions CI/CD (lint + build + lighthouse)
- Render auto-redeploys backend
- Vercel auto-redeploys frontend

---

## 6. Monitoring & Observability

| Tool | Purpose | Status |
|---|---|---|
| Sentry | Frontend + Backend error tracking | ⚙️ Configure DSN in dashboards |
| Render Logs | Backend runtime logs | ✅ Available in Render Dashboard |
| Vercel Analytics | Frontend performance | ✅ Enabled via Vercel Dashboard |
| GitHub Actions | CI/CD status | ✅ Active |
| Lighthouse CI | Performance audits on every push | ✅ Active |

---

## 7. Rollback Procedure

```bash
# Rollback to previous commit
git revert HEAD
git push origin main

# Or rollback to a specific commit
git revert <commit-hash>
git push origin main
```
Render and Vercel will auto-deploy the reverted code within 3 minutes.

---

## 8. Performance Baselines

| Metric | Baseline | Target | Status |
|---|---|---|---|
| Lighthouse Performance | 92 | ≥ 80 | ✅ |
| FCP | ~0.3s | < 1.6s | ✅ |
| LCP | ~0.9s | < 2.5s | ✅ |
| TBT | ~35ms | < 200ms | ✅ |
| CLS | 0.00 | < 0.1 | ✅ |
| API p95 (list expenses) | 640ms | < 1s | ✅ |
| Concurrent users (load tested) | 50 | 50 | ✅ |

---

## 9. Team Contacts

| Name | Role | GitHub |
|---|---|---|
| Hunny Sharma | Web Dev — DevOps / CI-CD | @hunny0025 |
| Mehul Chaudhari | Web Dev — Frontend UI | @mehulchaudhari14 |
| Kavinraj S | Web Dev — Frontend Components | @Kavinrajsaravanakumar |
| Shinjan Paul | Web Dev — Backend API | @shinjanpaul |
| Shivangii | Web Dev — QA & Testing | @Shivangii |
| Alok Jagtap | Web Dev — Backend / DB | @alokjagtap30 |

---

## 10. Known Limitations (v1)

| Item | Notes |
|---|---|
| Render free tier cold-start | ~30s delay after 15min inactivity. Upgrade to Starter plan ($7/mo) to eliminate. |
| No refresh tokens | Users re-login after 7 days. Planned for v2. |
| MongoDB Atlas M0 (free) | 512MB limit. Sufficient for demo. Upgrade for production scale. |
| No custom domain | Using auto-generated URLs. Add custom domain for client-facing deployment. |
