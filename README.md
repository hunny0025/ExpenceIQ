# ExpenceIQ
 A full-stack Expense Tracker with a comprehensive Analytics Dashboard.

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
**Fix:** Ask your team lead for the `.env` file.
Never commit `.env` to GitHub.