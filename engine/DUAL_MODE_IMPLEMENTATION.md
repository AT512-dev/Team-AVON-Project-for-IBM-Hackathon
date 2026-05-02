# Dual-Mode Implementation: Demo vs Live Scan

## Overview

CodeGuard AI now supports **two distinct scanning modes**:

1. **Demo Mode**: Uses mock vulnerable code for demonstrations and testing
2. **Live Mode**: Clones real repositories and performs authentic security scans with IBM WatsonX AI integration

This implementation ensures that the backend intelligently switches between mock data and real scanning based on user input.

---

## Architecture

### The Logic Gate

The core switching logic is implemented in `engine/controllers/auditController.js`:

```javascript
if (isDemoMode === true) {
  // DEMO MODE: Use mock repository
  return useMockData();
} else {
  // LIVE MODE: Run real audit with WatsonX
  return runRealAudit(inputUrl);
}
```

### Flow Diagram

```
User Request
    ↓
┌─────────────────────┐
│  POST /api/v1/scan  │
└─────────────────────┘
    ↓
┌─────────────────────┐
│  isDemoMode check   │
└─────────────────────┘
    ↓           ↓
  TRUE        FALSE
    ↓           ↓
┌─────────┐  ┌──────────────────┐
│  DEMO   │  │   LIVE MODE      │
│  MODE   │  │                  │
│         │  │ 1. Validate URL  │
│ Mock    │  │ 2. Clone Repo    │
│ Data    │  │ 3. Scan Files    │
│         │  │ 4. WatsonX AI    │
│         │  │ 5. Return Result │
└─────────┘  └──────────────────┘
```

---

## API Endpoint

### POST `/api/v1/scan`

**Unified endpoint that handles both Demo and Live modes.**

#### Request Body

```json
{
  "isDemoMode": boolean,        // true = Demo, false = Live
  "repoUrl": string,            // Required for Live mode
  "includeRemediation": boolean // Optional, default false
}
```

#### Response Format

**Demo Mode Response:**
```json
{
  "success": true,
  "mode": "demo",
  "data": {
    "vulnerabilities": [...],
    "overallScore": 65,
    "filesScanned": 2,
    "auditTimestamp": "2026-05-02T17:00:00.000Z"
  },
  "message": "Demo scan completed using sample vulnerable code"
}
```

**Live Mode Response:**
```json
{
  "success": true,
  "mode": "live",
  "data": {
    "vulnerabilities": [...],
    "overallScore": 78,
    "filesScanned": 45,
    "ai_powered": true,
    "ai_analyzed_count": 10,
    "auditTimestamp": "2026-05-02T17:00:00.000Z",
    "scanMode": "live"
  },
  "metadata": {
    "repoUrl": "https://github.com/user/repo.git",
    "workspaceId": "uuid-here",
    "filesScanned": 45,
    "scanTimestamp": "2026-05-02T17:00:00.000Z"
  },
  "message": "Live scan completed: analyzed 45 files from https://github.com/user/repo.git"
}
```

---

## Implementation Details

### 1. Controller Layer (`engine/controllers/auditController.js`)

**New Function: `unifiedScan`**

- **Purpose**: Main entry point that routes requests to Demo or Live mode
- **Validation**: 
  - Checks `isDemoMode` flag
  - Validates `repoUrl` for Live mode
  - Uses `gitService.validateGitUrl()` for URL validation
- **Error Handling**: Returns proper error responses for invalid URLs or clone failures

### 2. Service Layer (`engine/services/auditService.js`)

**New Functions:**

#### `performAuditLive(repoPath)`
- Performs real scan on cloned repository
- Integrates with IBM WatsonX for AI-powered analysis
- Enhances top 10 vulnerabilities with AI insights
- Returns results with `ai_powered: true` flag

#### `performAuditWithRemediationLive(repoPath)`
- Full AI-powered remediation for critical vulnerabilities
- Sends actual code to WatsonX with detailed prompts
- Generates step-by-step remediation plans
- Focuses on CRITICAL and HIGH severity issues

### 3. WatsonX Integration

**Prompt Template for Vulnerability Analysis:**
```
Analyze the following code for security vulnerabilities and provide remediation:

File: {filename}
Vulnerability Type: {type}
Severity: {severity}

Code:
```
{code_snippet}
```

Provide:
1. Detailed explanation of the vulnerability
2. Specific remediation steps
3. Secure code example
```

**AI Response Enhancement:**
- Each vulnerability gets AI analysis
- Includes root cause analysis
- Provides secure code replacements
- Adds testing recommendations

---

## Input Validation

### Demo Mode
- **Required**: `isDemoMode: true`
- **Optional**: `includeRemediation`
- **Ignored**: `repoUrl` (not needed)

### Live Mode
- **Required**: 
  - `isDemoMode: false`
  - `repoUrl` (valid Git URL)
- **Optional**: `includeRemediation`

### URL Validation Rules

Valid URL patterns:
- `https://github.com/user/repo.git`
- `https://gitlab.com/user/repo.git`
- `https://bitbucket.org/user/repo.git`

Invalid patterns (rejected):
- URLs with shell injection characters: `; & | $ ( ) { } [ ] < >`
- Path traversal attempts: `..`
- Non-HTTPS URLs (for security)
- Malformed URLs

---

## Error Handling

### Invalid URL Error
```json
{
  "success": false,
  "error": "Invalid repository URL",
  "message": "Please provide a valid GitHub, GitLab, or Bitbucket repository URL (HTTPS format recommended)"
}
```

### Clone Failure Error
```json
{
  "success": false,
  "error": "Failed to clone repository",
  "message": "Git clone failed with code 128: repository not found",
  "details": "Please ensure the repository URL is correct and publicly accessible"
}
```

### Missing URL Error
```json
{
  "success": false,
  "error": "Repository URL is required for live mode",
  "message": "Please provide a valid GitHub/GitLab repository URL"
}
```

---

## Security Features

### 1. No Shell Injection
- Uses `spawn()` with argument arrays, not `exec()` with string concatenation
- All Git commands are parameterized

### 2. URL Validation
- Regex-based validation for known Git hosting platforms
- Blocks dangerous characters
- Prevents path traversal

### 3. Isolated Workspaces
- Each clone gets a unique UUID-based directory
- Automatic cleanup after scan
- Path traversal protection in cleanup

### 4. Timeout Protection
- 2-minute timeout for Git clone operations
- Prevents hanging processes

---

## Usage Examples

### Example 1: Demo Mode Scan

```bash
curl -X POST http://localhost:3001/api/v1/scan \
  -H "Content-Type: application/json" \
  -d '{
    "isDemoMode": true,
    "includeRemediation": false
  }'
```

### Example 2: Live Mode Scan

```bash
curl -X POST http://localhost:3001/api/v1/scan \
  -H "Content-Type: application/json" \
  -d '{
    "isDemoMode": false,
    "repoUrl": "https://github.com/user/repo.git",
    "includeRemediation": false
  }'
```

### Example 3: Live Mode with AI Remediation

```bash
curl -X POST http://localhost:3001/api/v1/scan \
  -H "Content-Type: application/json" \
  -d '{
    "isDemoMode": false,
    "repoUrl": "https://github.com/user/repo.git",
    "includeRemediation": true
  }'
```

### Example 4: JavaScript/Node.js

```javascript
const axios = require('axios');

// Demo Mode
const demoResult = await axios.post('http://localhost:3001/api/v1/scan', {
  isDemoMode: true,
  includeRemediation: false
});

// Live Mode
const liveResult = await axios.post('http://localhost:3001/api/v1/scan', {
  isDemoMode: false,
  repoUrl: 'https://github.com/user/repo.git',
  includeRemediation: true
});
```

---

## Testing

### Run the Example Script

```bash
cd engine
node examples/unified-scan-example.js
```

This will test:
1. ✅ Demo mode scan
2. ✅ Invalid URL rejection
3. ✅ Missing URL rejection
4. ✅ Live mode scan (if URL provided)
5. ✅ Live mode with remediation (if URL provided)

---

## Frontend Integration

### State Management

The frontend should send a `live: true` flag when the user enters a URL:

```typescript
// When user clicks "Scan" button
const scanRepository = async (repoUrl: string) => {
  const response = await fetch('/api/v1/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      isDemoMode: false,  // Live mode
      repoUrl: repoUrl,
      includeRemediation: true
    })
  });
  
  const result = await response.json();
  
  if (result.mode === 'live') {
    // Display real scan results
    console.log('Real scan completed!');
    console.log(`AI-enhanced: ${result.data.ai_analyzed_count} vulnerabilities`);
  }
};

// When user clicks "Try Demo"
const runDemo = async () => {
  const response = await fetch('/api/v1/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      isDemoMode: true,
      includeRemediation: false
    })
  });
  
  const result = await response.json();
  
  if (result.mode === 'demo') {
    // Display demo results
    console.log('Demo scan completed!');
  }
};
```

---

## Performance Considerations

### Demo Mode
- **Speed**: Instant (uses pre-loaded mock data)
- **Resources**: Minimal (no cloning, no AI calls)
- **Cost**: Free

### Live Mode
- **Speed**: 30-120 seconds (depends on repo size)
- **Resources**: 
  - Disk space for clone
  - Network bandwidth
  - WatsonX API calls
- **Cost**: WatsonX API usage charges apply

### Optimization Tips
1. Use shallow clones (`--depth 1`)
2. Limit AI analysis to top 10 vulnerabilities
3. Async cleanup of workspaces
4. Cache WatsonX access tokens

---

## Troubleshooting

### Issue: "Invalid repository URL"
**Solution**: Ensure URL is in HTTPS format and from a supported platform (GitHub, GitLab, Bitbucket)

### Issue: "Failed to clone repository"
**Solution**: 
- Check if repository is public
- Verify URL is correct
- Ensure Git is installed on server

### Issue: "IBM WatsonX API unavailable"
**Solution**: 
- Check `.env` file has `IBM_CLOUD_API_KEY` and `WATSONX_PROJECT_ID`
- Verify API key is valid
- System will fallback to static analysis if AI fails

---

## Configuration

### Environment Variables

```bash
# Required for Live Mode with AI
IBM_CLOUD_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
IBM_CLOUD_URL=https://us-south.ml.cloud.ibm.com
MODEL_ID=ibm/granite-13b-chat-v2

# Server Configuration
PORT=3001
```

---

## Backward Compatibility

All legacy endpoints remain functional:
- `POST /api/v1/audit` - Original audit endpoint
- `POST /api/v1/audit/remediation` - Remediation endpoint
- `GET /api/v1/demo` - Demo endpoint
- `POST /api/v1/fetch-repo` - Git fetch endpoint

The new `/api/v1/scan` endpoint is the recommended way forward.

---

## Future Enhancements

1. **Caching**: Cache scan results for frequently scanned repositories
2. **Webhooks**: Support for GitHub/GitLab webhooks for automatic scanning
3. **Private Repos**: Add SSH key support for private repositories
4. **Batch Scanning**: Scan multiple repositories in parallel
5. **Real-time Progress**: WebSocket support for live scan progress updates

---

## Credits

**Implementation by**: Team AVON - CodeGuard AI  
**AI Partner**: IBM WatsonX (granite-13b-chat-v2)  
**Date**: May 2026  
**Version**: 2.0.0

---

## Support

For issues or questions:
- Check the example script: `engine/examples/unified-scan-example.js`
- Review error messages in API responses
- Check server logs for detailed error information