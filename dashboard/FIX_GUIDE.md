# Quick Fix Guide for Dashboard Issues

## Issue 1: Git Push Failed (Large Files - node_modules)

The error occurred because `node_modules` was accidentally committed to git. Here's how to fix it:

### Solution:

```bash
# 1. Remove node_modules from git history (keep local files)
cd dashboard
git rm -r --cached node_modules

# 2. Commit the removal
git commit -m "fix: remove node_modules from git tracking"

# 3. Push the fix
git push origin feature/dashboard-ui
```

**Note:** This only removes node_modules from git tracking, your local files remain intact.

---

## Issue 2: API Showing Offline Status

The dashboard is trying to connect to `http://localhost:3001/api/v1` but the backend engine server isn't running.

### Solution:

You need to start Harshal's backend engine server:

```bash
# Open a NEW terminal (keep dashboard running in current terminal)
cd engine

# Install dependencies (if not already done)
npm install

# Start the engine server
npm start
# OR
node server.js
```

The engine should start on port 3001 and the dashboard will automatically detect it's online.

---

## Issue 3: 404 Errors on API Endpoints

**Current errors:**

```
GET /api/v1/health 404
GET /api/v1/demo 404
```

**Root cause:** The backend engine server is not running.

**Fix:** Start the engine server (see Issue 2 above)

---

## Verification Steps

After applying fixes:

1. **Check Git Status:**

   ```bash
   git status
   # Should show: "nothing to commit, working tree clean"
   ```

2. **Check API Status in Dashboard:**
   - Open http://localhost:3001
   - Top-right corner should show "🟢 API Online"
   - If still offline, check engine server logs

3. **Test Demo Mode:**
   - Click "Run Security Audit" button
   - Should see vulnerability data appear

---

## Quick Commands Summary

```bash
# Terminal 1 - Dashboard (already running)
cd dashboard
npm run dev
# Runs on http://localhost:3001

# Terminal 2 - Engine Backend (need to start)
cd engine
npm install  # if first time
npm start
# Should run on port 3001 (backend)

# Terminal 3 - Git fixes
cd dashboard
git rm -r --cached node_modules
git commit -m "fix: remove node_modules from git tracking"
git push origin feature/dashboard-ui
```

---

## Expected Behavior After Fixes

✅ Dashboard runs on http://localhost:3001  
✅ Engine API runs on http://localhost:3001 (backend)  
✅ API status shows "🟢 Online"  
✅ Demo audit works  
✅ Git push succeeds without errors  
✅ No node_modules in git

---

## If Engine Server Won't Start

Check these:

1. **Port already in use:**

   ```bash
   # Kill process on port 3001
   # Windows:
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

2. **Missing dependencies:**

   ```bash
   cd engine
   npm install
   ```

3. **Check engine/.env file:**
   - Should have IBM Watson credentials
   - Ask Harshal if missing

---

**Last Updated:** 2026-05-02  
**Your Role:** Dashboard UI Developer (Ali)  
**Harshal's Role:** Engine/API Backend Developer
