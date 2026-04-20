# 🛠️ Local Development Environment Setup Guide

**Project:** ExpenseIQ  
**Author:** Shivangi Girjesh Pandey  
**Role:** Backend Support & QA  
**Date:** April 20, 2026

---

## Tools Required

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v20.19.6 (LTS) | JavaScript runtime for backend |
| npm | 10.8.2 | Package manager |
| MongoDB Compass | v1.x | GUI for MongoDB database |
| VS Code | Latest | Code editor |
| Git | 2.50.1.windows.1 | Version control |
| Postman | Latest | API testing |

---

## 1. Node.js & npm
- Download from [nodejs.org](https://nodejs.org)
- Install the **LTS version**
- Verify:
```bash
node -v
npm -v
```
---

## 2. Git
- Download from [git-scm.com](https://git-scm.com)
- Verify:
```bash
git --version
```
![All version check done ](image.png)
---

## 3. MongoDB Compass
- Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Open the app → Connect using: `mongodb://localhost:27017`

![Mongodb Conneceted](image-1.png)

---

## 4. VS Code
- Download from [code.visualstudio.com](https://code.visualstudio.com)
- Recommended Extensions:
  - ESLint
  - Thunder Client (optional, for API testing inside VS Code)
  ![Eslint extension ](image-2.png)
  ![Thunder bolt ](image-3.png)
---

## 5. Postman
- Download from [postman.com](https://www.postman.com)
- Create a free account and set up a new Workspace: **ExpenseIQ**

![Postman](image-4.png)
---
## ✅ Setup Checklist

- [x] Node.js installed — v20.19.6
- [x] npm working — v10.8.2
- [x] Git installed — v2.50.1
- [x] MongoDB Compass installed and connected
- [x] VS Code installed with ESLint extension
- [x] Postman installed with ExpenseIQ workspace