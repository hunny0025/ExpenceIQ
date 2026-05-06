# 💰 ExpenseIQ

> A production-grade full-stack Expense Tracker with a comprehensive Analytics Dashboard — built for real-world use.

[![CI/CD](https://github.com/hunny0025/ExpenceIQ/actions/workflows/ci.yml/badge.svg)](https://github.com/hunny0025/ExpenceIQ/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-92%2F100-green)](docs/lighthouse-baseline.md)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Performance](#performance)
- [Team](#team)
- [License](#license)

---

## 🧾 About

**ExpenseIQ** is a production-grade expense management platform that enables users to track spending, manage budgets, generate reports, and visualize financial data through an intuitive analytics dashboard.

Built as a multi-team collaborative project with separate Web and Mobile development tracks, following an agile workflow with daily CI/CD pipelines.

---

## ✨ Features

- 🔐 **User Authentication** — JWT-based signup, login, and session management
- 💸 **Expense Management** — Full CRUD with categories, date filters, search, and pagination
- 📊 **Analytics Dashboard** — Interactive charts (bar, pie, calendar heatmap) via Chart.js
- 💰 **Budget Planner** — Set budgets per category with visual progress tracking and 80% alerts
- 🔍 **Advanced Filters** — Filter by date range, category, amount, with export support
- 🔔 **Budget Alerts** — Real-time notifications when spending exceeds 80% of budget
- 📄 **Report Exports** — Export to CSV/PDF
- 🛡️ **Security** — Helmet.js, rate limiting (100 req/15min), CORS whitelist, Joi validation
- 📈 **Observability** — Sentry error tracking (frontend + backend), Lighthouse CI audits
- 🚀 **Production Deployed** — CI/CD with GitHub Actions, Render (backend), Vercel (frontend)

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React 18, TailwindCSS, Chart.js, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT (jsonwebtoken), bcrypt |
| **Validation** | Joi middleware |
| **Security** | Helmet.js, express-rate-limit, CORS |
| **Error Tracking** | Sentry (@sentry/react, @sentry/node) |
| **CI/CD** | GitHub Actions |
| **Hosting** | Render (backend), Vercel (frontend) |
| **Load Testing** | Artillery.io |
| **Performance** | Lighthouse CI |

---

## 📁 Project Structure

```text
ExpenseIQ/
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions — Lint, Build, Lighthouse
├── backend/
│   ├── src/
│   │   ├── config/           # DB connection
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, error, validation
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routers
│   │   ├── services/         # Business logic (budget alerts)
│   │   ├── utils/            # Helpers, seeder
│   │   └── server.js         # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── charts/           # Chart.js wrappers
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   └── main.tsx          # App entry + Sentry init
│   ├── vercel.json           # CDN headers + SPA rewrites
│   └── vite.config.ts        # Build config + chunk splitting
├── docs/
│   ├── deployment-handover.md      # Full deployment guide
│   ├── security-audit.md           # Security audit report
│   ├── load-test-report.md         # Artillery load test results
│   ├── pre-production-checklist.md # Pre-launch checklist
│   ├── smoke-test-report.md        # Production smoke test
│   └── lighthouse-baseline.md      # Lighthouse performance baseline
├── artillery.yml             # Load test configuration
├── lighthouserc.cjs          # Lighthouse CI config
├── render.yaml               # Render deployment blueprint
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB Atlas** account (or local MongoDB)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/hunny0025/ExpenceIQ.git
cd ExpenceIQ

# Setup Backend
cd backend
npm install
cp .env.example .env    # Fill in your environment variables
npm run dev             # Starts on http://localhost:5000

# Setup Frontend (new terminal)
cd frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expenseiq
JWT_SECRET=your_strong_random_jwt_secret_min_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
SENTRY_DSN=                 # Optional: your Sentry DSN
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
VITE_SENTRY_DSN=            # Optional: your Sentry DSN
```

---

## 📖 API Documentation

Full Postman collection: [`docs/ExpenceIQ.postman_collection.json`](docs/ExpenceIQ.postman_collection.json)

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login & get JWT token | Public |
| `GET` | `/api/auth/me` | Get current user profile | Private |
| `GET` | `/api/expenses` | List expenses (pagination, search, filters) | Private |
| `POST` | `/api/expenses` | Create new expense | Private |
| `PUT` | `/api/expenses/:id` | Update expense | Private |
| `DELETE` | `/api/expenses/:id` | Delete expense | Private |
| `GET` | `/api/expenses/search` | Search expenses (`?q=`) | Private |
| `GET` | `/api/categories` | List categories | Private |
| `POST` | `/api/categories` | Create category | Private |
| `GET` | `/api/budgets` | Get monthly budgets | Private |
| `POST` | `/api/budgets` | Set budget for category | Private |
| `GET` | `/api/analytics/summary` | Spending analytics summary | Private |
| `GET` | `/api/reports/csv` | Export CSV report | Private |
| `GET` | `/api/health` | API health check | Public |

---

## 🌐 Deployment

| Service | Platform | URL |
|:---|:---|:---|
| **Frontend** | Render Static / Vercel | https://expenseiq-frontend.onrender.com |
| **Backend API** | Render Web Service | https://expenseiq-api.onrender.com |
| **Health Check** | — | https://expenseiq-api.onrender.com/api/health |
| **Database** | MongoDB Atlas (Singapore) | Private |

### Deploy Your Own

**Backend (Render):**
1. Go to [dashboard.render.com](https://dashboard.render.com) → New → Blueprint
2. Connect `hunny0025/ExpenceIQ` — Render auto-detects `render.yaml`
3. Add secrets (`MONGO_URI`, `JWT_SECRET`) in Dashboard → Environment
4. Auto-deploys on every push to `main`

**Frontend (Vercel):**
1. Go to [vercel.com/new](https://vercel.com/new) → Import repository
2. Set Root Directory to `frontend`
3. Add `VITE_API_URL=https://expenseiq-api.onrender.com/api`
4. Auto-deploys on every push to `main`

For full deployment details: [`docs/deployment-handover.md`](docs/deployment-handover.md)

---

## 📈 Performance

Lighthouse CI runs on every push to `main` and `staging`.

| Metric | Score | Target |
|:---|:---|:---|
| 🏆 Performance | 92/100 | ≥ 80 |
| ♿ Accessibility | 91/100 | ≥ 85 |
| ✅ Best Practices | 95/100 | ≥ 85 |
| 🔍 SEO | 90/100 | ≥ 85 |
| FCP | ~0.3s | < 1.6s |
| LCP | ~0.9s | < 2.5s |
| TBT | ~35ms | < 200ms |
| CLS | 0.00 | < 0.1 |

Load tested with Artillery.io — **50 concurrent users, 97.96% success rate**.
Full report: [`docs/load-test-report.md`](docs/load-test-report.md)

---

## 🛠️ Local Setup Troubleshooting

| Problem | Fix |
|:---|:---|
| `node: command not found` | Reinstall Node.js from [nodejs.org](https://nodejs.org) |
| MongoDB connection failed | Check `MONGO_URI` in `.env` and Atlas IP whitelist |
| Port 5000 already in use | Run `npx kill-port 5000` |
| `npm install` fails | Delete `node_modules` and run `npm install` again |
| Git push rejected | Run `git pull origin main` then push again |
| `.env` file missing | Copy from `.env.example` and fill in values |

---

## 👥 Team — Web Development

| Name | Role | GitHub |
|:---|:---|:---|
| **Hunny Sharma** | DevOps & Release Lead | [@hunny0025](https://github.com/hunny0025) |
| **Mehul Chaudhari** | Frontend Developer | [@mehulchaudhari14](https://github.com/mehulchaudhari14) |
| **Kavinraj S** | Frontend Developer | [@Kavinrajsaravanakumar](https://github.com/Kavinrajsaravanakumar) |
| **Shinjan Paul** | Backend Core Lead | [@shinjanpaul](https://github.com/shinjanpaul) |
| **Alok Jagtap** | Database Engineer | [@alokjagtap30](https://github.com/alokjagtap30) |
| **Shivangii** | QA & Testing | [@Shivangii](https://github.com/Shivangii) |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <strong>Team ExpenseIQ</strong> · 2026
</p>
