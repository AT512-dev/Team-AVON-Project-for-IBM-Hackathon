# 🚀 CodeGuard AI - Quick Start Guide

## Prerequisites

- **Node.js** v16+ installed
- **npm** or **yarn** package manager
- **IBM WatsonX** or **Google Gemini** API key

---

## 🎯 One-Click Setup (Windows)

### Step 1: Install Dependencies

```bash
# Install Engine dependencies
cd engine
npm install

# Install Dashboard dependencies
cd ../dashboard
npm install
```

### Step 2: Configure API Key

1. Navigate to `engine/` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and add your API key:
   ```env
   IBM_CLOUD_API_KEY=your_actual_api_key_here
   WATSONX_PROJECT_ID=your_project_id_here
   ```

### Step 3: Launch Everything

**Double-click** `start-codeguard.bat` in the root folder!

That's it! Two terminal windows will open:
- **Engine**: http://localhost:3001
- **Dashboard**: http://localhost:3000

---

## 🐧 Manual Setup (Linux/Mac)

### Terminal 1 - Start Engine
```bash
cd engine
node server.js
```

### Terminal 2 - Start Dashboard
```bash
cd dashboard
npm run dev
```

---

## 🔑 Getting Your API Key

### Option 1: IBM WatsonX (Recommended)

1. Go to [IBM Cloud](https://cloud.ibm.com/)
2. Create a WatsonX.ai instance
3. Navigate to **Resource List** → **AI/Machine Learning**
4. Click your WatsonX instance
5. Go to **Manage** → **Access (IAM)**
6. Create an API key
7. Copy the **Project ID** from your WatsonX project

### Option 2: Google Gemini

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Get API Key**
3. Create a new API key
4. Copy the key
5. In `.env`, uncomment Gemini settings and set `USE_GEMINI=true`

---

## ✅ Verify Installation

### Test Engine
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "CodeGuard AI Engine",
  "version": "3.0"
}
```

### Test Dashboard
Open browser: http://localhost:3000

You should see the CodeGuard AI dashboard interface.

---

## 🔒 Security Best Practices

### ⚠️ CRITICAL: API Key Security

1. **NEVER** commit `.env` file to Git
2. **NEVER** expose API keys in frontend code
3. **NEVER** share API keys in screenshots or logs
4. **ALWAYS** keep API keys in `engine/.env` only
5. **ROTATE** API keys every 90 days

### Verify .gitignore

Check that `.env` is listed in `.gitignore`:
```bash
cat .gitignore | grep .env
```

---

## 🧪 Run Your First Scan

### Using the Dashboard (Recommended)

1. Open http://localhost:3000
2. Click **"Start New Audit"**
3. Select files or paste code
4. Click **"Run Security Scan"**
5. View results in real-time

### Using the API

```bash
curl -X POST http://localhost:3001/api/v1/audit \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {
        "file": "routes/user.js",
        "content": "const db = require(\"../db/database\");\n\nfunction getUser(req, res) {\n  const userId = req.query.id;\n  db.findUserById(userId, (result) => { res.send(result); });\n}\n\nmodule.exports = { getUser };"
      }
    ]
  }'
```

---

## 🛠️ Troubleshooting

### Engine won't start

**Problem**: `Error: IBM_CLOUD_API_KEY is not set`

**Solution**: 
1. Check that `.env` file exists in `engine/` folder
2. Verify API key is set correctly
3. Restart the engine

### Dashboard shows "Connection Error"

**Problem**: Dashboard can't reach the engine

**Solution**:
1. Verify engine is running on port 3001
2. Check firewall settings
3. Try: `curl http://localhost:3001/health`

### API Key Invalid

**Problem**: `401 Unauthorized` or `403 Forbidden`

**Solution**:
1. Verify API key is correct (no extra spaces)
2. Check API key hasn't expired
3. Verify you have credits/quota remaining
4. Test authentication: `node engine/config/ibmBobClient.js`

---

## 📚 Next Steps

- Read [ARCHITECTURE.md](dashboard/ARCHITECTURE.md) for system design
- Check [API_DOCUMENTATION.md](engine/API_DOCUMENTATION.md) for API details
- Review [TESTING_GUIDE.md](dashboard/TESTING_GUIDE.md) for testing
- See [demo_samples/](demo_samples/) for example scans

---

## 🆘 Need Help?

- **Documentation**: Check the `/docs` folder
- **Examples**: See `/demo_samples` folder
- **Issues**: Review error logs in terminal
- **Team**: Contact Team AVON

---

**Made with ❤️ by Team AVON**