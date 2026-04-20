# 💰 ExpenseIQ

> A full-stack Expense Tracker with a comprehensive Analytics Dashboard — built for real-world use.

[![CI/CD](https://github.com/hunny0025/ExpenceIQ/actions/workflows/ci.yml/badge.svg)](https://github.com/hunny0025/ExpenceIQ/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Local Setup Troubleshooting](#local-setup-troubleshooting)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)

---

## 🧾 About

**ExpenseIQ** is a production-grade expense management platform that enables users to track spending, manage budgets, generate reports, and visualize financial data through an intuitive analytics dashboard.

Built as a multi-team collaborative project with separate Web and Mobile development tracks.

---

## ✨ Features

- 🔐 **User Authentication** — JWT-based signup, login, and session management
- 💸 **Expense Management** — Full CRUD with categories, tags, and receipts
- 📊 **Analytics Dashboard** — Interactive charts and spending breakdowns (Chart.js)
- 💰 **Monthly Budget Planner** — Set budgets per category with progress tracking
- 🔍 **Advanced Filters** — Search, sort, and filter by date, category, and amount
- 📄 **Report Exports** — Download spending reports as PDF or CSV
- 🔔 **Notifications** — Budget alerts and spending reminders
- 📱 **Mobile Ready** — Responsive design + companion mobile app (separate team)
- 🚀 **Production Deployed** — CI/CD with GitHub Actions, Vercel + Railway

---

## 🛠️ Local Setup Troubleshooting

### 1. `node` or `npm` not recognized
**Problem:** Terminal says `node is not recognized`

**Fix:** Node.js not installed or PATH not set.
Reinstall from [nodejs.org](https://nodejs.org) and restart terminal.

### 2. MongoDB connection failed
**Problem:** Cannot connect to `mongodb://localhost:27017`

**Fix:** MongoDB service is not running.
Open MongoDB Compass and manually connect.

### 3. Port already in use
**Problem:** `Error: listen EADDRINUSE :::5000`

**Fix:** Another process is using that port. Run:
```bash
npx kill-port 5000
```

### 4. `npm install` fails
**Problem:** Errors during dependency installation

**Fix:** Delete `node_modules` and try again:
```bash
rm -rf node_modules
npm install
```

### 5. Git push rejected
**Problem:** `rejected — non-fast-forward`

**Fix:** Someone pushed before you. Run:
```bash
git pull origin main
git push origin main
```

### 6. `.env` file missing
**Problem:** App crashes on start — missing environment variables

**Fix:** Ask your team lead for the `.env` file. Never commit `.env` to GitHub.

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|:-------------|:------------------------------------|
| **Frontend** | React 18, Tailwind CSS, Chart.js    |
| **Backend**  | Node.js, Express.js                 |
| **Database** | MongoDB Atlas, Mongoose ODM         |
| **Auth**     | JWT, bcrypt                         |
| **DevOps**   | GitHub Actions, Vercel, Railway     |
| **Testing**  | Jest, Supertest, React Testing Lib  |

---

## 📁 Project Structure

```text
ExpenseIQ/
├── frontend/              # React 18 + Tailwind CSS SPA
├── backend/               # Node.js + Express REST API
├── mobile/                # React Native app (App Dev team)
├── .github/               # GitHub Actions CI/CD pipeline
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** (local or Atlas connection string)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/hunny0025/ExpenceIQ.git
cd ExpenceIQ

# Setup Backend
cd backend
npm install
cp .env.example .env    # Configure your environment variables
npm run dev

# Setup Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API on `http://localhost:5000`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expenseiq
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📖 API Documentation

| Method   | Endpoint               | Description              | Auth     |
|:---------|:-----------------------|:-------------------------|:---------|
| `POST`   | `/api/auth/register`   | Register new user        | Public   |
| `POST`   | `/api/auth/login`      | Login & get JWT token    | Public   |
| `GET`    | `/api/auth/me`         | Get current user profile | Private  |
| `GET`    | `/api/expenses`        | List all expenses        | Private  |
| `POST`   | `/api/expenses`        | Create new expense       | Private  |
| `PUT`    | `/api/expenses/:id`    | Update expense           | Private  |
| `DELETE` | `/api/expenses/:id`    | Delete expense           | Private  |
| `GET`    | `/api/categories`      | List categories          | Private  |
| `POST`   | `/api/categories`      | Create category          | Private  |
| `GET`    | `/api/budgets`         | Get monthly budgets      | Private  |
| `POST`   | `/api/budgets`         | Set budget for category  | Private  |
| `GET`    | `/api/analytics`       | Get spending analytics   | Private  |
| `GET`    | `/api/reports/pdf`     | Export PDF report        | Private  |
| `GET`    | `/api/reports/csv`     | Export CSV report        | Private  |

> Full Postman collection will be available in `backend/docs/ExpenseIQ.postman_collection.json`

---

## 🌐 Deployment

| Service      | Platform   | URL                                    |
|:-------------|:-----------|:---------------------------------------|
| **Frontend** | Vercel     | _Coming soon_                          |
| **Backend**  | Railway    | _Coming soon_                          |
| **Database** | MongoDB Atlas | _Private_                           |

---

## 👥 Team — Web Development

| Name          | Role                       |
|:--------------|:---------------------------|
| **Hunny**     | DevOps & Release Lead      |
| **Mehul**     | Frontend Developer         |
| **Shinjan**   | Backend Core Lead          |
| **Kavinraj**  | Frontend Developer         |
| **Alok**      | Database Engineer          |
| **Shivangi**  | Backend Support & QA       |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <strong>Team ExpenseIQ</strong> · 2026
</p>
