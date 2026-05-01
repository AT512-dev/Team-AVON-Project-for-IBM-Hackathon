# IBM Cloud & WatsonX Setup Guide

**Complete step-by-step guide to get your API credentials**

---

## Prerequisites
- IBM Cloud account (free tier available)
- Access to IBM WatsonX

---

## Step 1: Get IBM Cloud API Key

### Option A: Create New API Key

1. **Go to IBM Cloud Console**
   - Visit: https://cloud.ibm.com/
   - Log in with your IBM ID

2. **Navigate to API Keys**
   - Click on **"Manage"** in the top menu
   - Select **"Access (IAM)"**
   - Click **"API keys"** in the left sidebar
   - OR directly visit: https://cloud.ibm.com/iam/apikeys

3. **Create API Key**
   - Click **"Create"** button (blue button on the right)
   - Enter a name: `CodeGuard-AI-Key` or `Team-AVON-Key`
   - Add description: `API key for CodeGuard AI security audit engine`
   - Click **"Create"**

4. **Copy Your API Key**
   - ⚠️ **IMPORTANT**: Copy the API key immediately!
   - You won't be able to see it again
   - Click **"Copy"** or **"Download"** to save it
   - Store it securely

5. **Add to .env file**
   ```env
   IBM_CLOUD_API_KEY=paste_your_key_here
   ```

### Option B: Use Existing API Key

If you already have an API key:
1. Go to https://cloud.ibm.com/iam/apikeys
2. Find your existing key
3. If you forgot it, you'll need to create a new one (keys can't be retrieved)

---

## Step 2: Get WatsonX Project ID

### Method 1: From WatsonX Dashboard

1. **Go to WatsonX**
   - Visit: https://dataplatform.cloud.ibm.com/wx/home
   - Or from IBM Cloud dashboard, search for "WatsonX"

2. **Create or Select a Project**
   - If you don't have a project:
     - Click **"Create a project"**
     - Choose **"Create an empty project"**
     - Name it: `CodeGuard-AI-Project`
     - Click **"Create"**
   
   - If you have a project:
     - Click on your project name

3. **Get Project ID**
   - Once in the project, click on **"Manage"** tab
   - Look for **"General"** section
   - Find **"Project ID"** (it's a long string like: `12345678-1234-1234-1234-123456789abc`)
   - Click the **copy icon** next to it

4. **Add to .env file**
   ```env
   WATSONX_PROJECT_ID=paste_your_project_id_here
   ```

### Method 2: From URL

When you're in your WatsonX project, look at the URL:
```
https://dataplatform.cloud.ibm.com/projects/YOUR_PROJECT_ID_HERE?context=wx
```
The long string after `/projects/` is your Project ID.

---

## Step 3: Choose Model ID

### Available Models

IBM WatsonX offers several models. Choose based on your needs:

#### Recommended for Security Analysis:

1. **IBM Granite (Recommended)**
   ```env
   MODEL_ID=ibm/granite-13b-chat-v2
   ```
   - Best for code analysis
   - Optimized for technical tasks
   - Good balance of speed and accuracy

2. **Meta Llama 2**
   ```env
   MODEL_ID=meta-llama/llama-2-70b-chat
   ```
   - More powerful but slower
   - Better for complex reasoning
   - Higher token cost

3. **Google Flan-UL2**
   ```env
   MODEL_ID=google/flan-ul2
   ```
   - Good for general tasks
   - Fast responses
   - Lower cost

#### How to Check Available Models:

1. Go to your WatsonX project
2. Click **"Prompt Lab"** or **"Foundation models"**
3. Browse available models
4. Copy the model ID (format: `provider/model-name`)

---

## Step 4: Set IBM Cloud Region URL

### Choose Your Region:

```env
# US South (Default - Recommended)
IBM_CLOUD_URL=https://us-south.ml.cloud.ibm.com

# EU Germany
IBM_CLOUD_URL=https://eu-de.ml.cloud.ibm.com

# UK London
IBM_CLOUD_URL=https://eu-gb.ml.cloud.ibm.com

# Japan Tokyo
IBM_CLOUD_URL=https://jp-tok.ml.cloud.ibm.com
```

**How to find your region:**
1. In IBM Cloud dashboard, check the top-right corner
2. It shows your current region (e.g., "Dallas" = us-south)
3. Use the corresponding URL above

---

## Complete .env File Example

After getting all credentials, your `.env` file should look like:

```env
# IBM Cloud & WatsonX Configuration
IBM_CLOUD_API_KEY=abcdefghijklmnopqrstuvwxyz1234567890ABCD
WATSONX_PROJECT_ID=12345678-1234-1234-1234-123456789abc
IBM_CLOUD_URL=https://us-south.ml.cloud.ibm.com
MODEL_ID=ibm/granite-13b-chat-v2

# Application Configuration
PORT=3000
NODE_ENV=development
```

---

## Step 5: Verify Setup

### Test Your Configuration

1. **Start the server:**
   ```bash
   cd Team-AVON-Project/engine
   npm install
   npm start
   ```

2. **Check the logs:**
   You should see:
   ```
   [IBM] Successfully authenticated with IBM Cloud
   [IBM] Project ID: 12345678-1234-1234-1234-123456789abc
   [IBM] Model: ibm/granite-13b-chat-v2
   [IBM] Region: https://us-south.ml.cloud.ibm.com
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   ```

   Expected response:
   ```json
   {
     "status": "ok",
     "service": "CodeGuard AI Engine",
     "version": "1.0.0"
   }
   ```

4. **Test with demo:**
   ```bash
   curl http://localhost:3000/api/v1/demo
   ```

---

## Troubleshooting

### Error: "Failed to authenticate with IBM Cloud"

**Possible causes:**
1. Invalid API key
2. API key doesn't have proper permissions
3. Network/firewall issues

**Solutions:**
- Verify API key is correct (no extra spaces)
- Create a new API key with full permissions
- Check internet connection

### Error: "IBM Cloud credentials not configured"

**Solution:**
- Make sure `.env` file exists in `Team-AVON-Project/engine/` directory
- Check that all required variables are set
- Restart the server after updating `.env`

### Error: "Project not found"

**Solution:**
- Verify Project ID is correct
- Make sure you have access to the project
- Check that the project is in the same region as your API key

### Error: "Model not found"

**Solution:**
- Verify model ID is correct
- Check if model is available in your region
- Try a different model (e.g., `ibm/granite-13b-chat-v2`)

---

## Free Tier Limits

### IBM Cloud Free Tier:
- ✅ 20,000 API calls per month
- ✅ 5 GB storage
- ✅ Access to WatsonX Lite plan

### WatsonX Free Tier:
- ✅ Limited tokens per month
- ✅ Access to select models
- ✅ 1 project

**Tip:** Monitor your usage in IBM Cloud dashboard to avoid unexpected charges.

---

## Security Best Practices

1. **Never commit .env file to Git**
   - Already in `.gitignore`
   - Double-check before pushing

2. **Rotate API keys regularly**
   - Create new keys every 90 days
   - Delete old keys

3. **Use different keys for dev/staging/prod**
   - Create separate API keys for each environment

4. **Limit API key permissions**
   - Only grant necessary permissions
   - Use service IDs for production

5. **Monitor API usage**
   - Check IBM Cloud dashboard regularly
   - Set up billing alerts

---

## Additional Resources

### Official Documentation:
- IBM Cloud API Keys: https://cloud.ibm.com/docs/account?topic=account-userapikey
- WatsonX Documentation: https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/welcome-main.html
- WatsonX API Reference: https://cloud.ibm.com/apidocs/watsonx-ai

### Video Tutorials:
- IBM Cloud Getting Started: https://www.youtube.com/ibmcloud
- WatsonX Tutorials: https://www.ibm.com/products/watsonx-ai

### Support:
- IBM Cloud Support: https://cloud.ibm.com/unifiedsupport/supportcenter
- Community Forum: https://community.ibm.com/

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│  IBM CLOUD CREDENTIALS QUICK REFERENCE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. API Key:                                                │
│     → https://cloud.ibm.com/iam/apikeys                     │
│     → Click "Create" → Copy key                             │
│                                                             │
│  2. Project ID:                                             │
│     → https://dataplatform.cloud.ibm.com/wx/home            │
│     → Open project → Manage tab → Copy Project ID          │
│                                                             │
│  3. Model ID:                                               │
│     → Recommended: ibm/granite-13b-chat-v2                  │
│     → Alternative: meta-llama/llama-2-70b-chat              │
│                                                             │
│  4. Region URL:                                             │
│     → US: https://us-south.ml.cloud.ibm.com                 │
│     → EU: https://eu-de.ml.cloud.ibm.com                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**Need Help?**

If you're stuck, check:
1. This guide's troubleshooting section
2. IBM Cloud documentation
3. Team AVON support

**Last Updated**: May 1, 2024  
**Team AVON - IBM Hackathon**