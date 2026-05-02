# CodeGuard AI

Static code analysis engine with automated vulnerability detection and AI-powered remediation. Built for the IBM Bob Hackathon 2026 by Team AVON.

## Overview

CodeGuard AI performs deterministic static analysis on codebases to identify OWASP Top 10 vulnerabilities, tracks data flows across file boundaries, and generates remediation strategies using IBM WatsonX. The system runs entirely offline except for optional AI-enhanced analysis.

**Core capabilities:**
- Pattern-based vulnerability detection (29 vulnerability types)
- Cross-file data flow tracking with taint analysis
- Dependency graph construction and function call tracing
- CVSS scoring and CWE mapping
- Automated remediation plan generation
- Multiple output formats (JSON, HTML, Markdown)

**Detection coverage:**
- SQL injection (parameterized query violations)
- NoSQL injection ($where, $regex exploitation)
- Command injection (exec, spawn, shell=true)
- XSS (innerHTML, dangerouslySetInnerHTML)
- Authentication failures (weak passwords, missing JWT expiry)
- Cryptographic failures (MD5, SHA1, hardcoded secrets)
- SSRF (unvalidated URL fetching)
- Code injection (eval, Function constructor)
- Access control violations (missing auth checks)
- Security misconfigurations (CORS wildcards, disabled SSL)

## Installation

Prerequisites:
- Node.js 16+
- IBM WatsonX API key (optional, for AI remediation)

```bash
# Install engine dependencies
cd engine
npm install

# Install dashboard dependencies (optional)
cd ../dashboard
npm install
```

## Configuration

Create `engine/.env`:

```env
# IBM WatsonX (optional - system works without it)
IBM_CLOUD_API_KEY=your_api_key
WATSONX_PROJECT_ID=your_project_id
IBM_CLOUD_URL=https://us-south.ml.cloud.ibm.com
MODEL_ID=ibm/granite-13b-chat-v2

# Server
PORT=3001
NODE_ENV=production
```

If you skip IBM credentials, the system falls back to static analysis only. No AI-generated remediation, but all vulnerability detection still works.

## Quick Start

### Windows (one-click)
Double-click `start-codeguard.bat` in the root directory.

### Manual start

Terminal 1 - Engine:
```bash
cd engine
node server.js
```

Terminal 2 - Dashboard (optional):
```bash
cd dashboard
npm run dev
```

Engine: http://localhost:3001  
Dashboard: http://localhost:3000

### Verify installation

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

## Usage

### API scan

```bash
curl -X POST http://localhost:3001/api/v1/audit \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {
        "file": "routes/user.js",
        "content": "const userId = req.query.id; db.query(`SELECT * FROM users WHERE id = ${userId}`);"
      }
    ]
  }'
```

Response includes:
- Vulnerability list with severity, line numbers, CVSS scores
- Overall security score (0-100)
- Impact metrics (estimated time saved, risk score)
- Fix suggestions

### Dashboard scan

1. Navigate to http://localhost:3000
2. Upload url of the repository you want to scan.
3. Change the mode to Live API, using toggle button.
4. Click "Run Audit Now"
5. View real-time results

### Demo scan

```bash
curl http://localhost:3001/api/v1/demo
```

Runs analysis on pre-loaded vulnerable code (29 vulnerabilities across 2 files).

## API Endpoints

**POST /api/v1/audit**  
Run security audit on provided files.

**POST /api/v1/audit/remediation**  
Run audit with AI-powered fix generation (requires IBM credentials).

**GET /api/v1/demo**  
Demo scan with sample vulnerable code.

**GET /api/v1/metrics**  
Time-saved and efficiency metrics.

**GET /api/v1/vulnerabilities/:severity**  
Filter by CRITICAL, HIGH, MEDIUM, or LOW.

**GET /health**  
Service health check.

See `ARCHITECTURE.md` for detailed API documentation and request/response schemas.

## Example Output

```json
{
  "success": true,
  "data": {
    "scan_summary": {
      "total_issues": 12,
      "critical": 4,
      "high": 5,
      "medium": 2,
      "low": 1
    },
    "vulnerabilities": [
      {
        "type": "SQL_INJECTION",
        "severity": "CRITICAL",
        "file": "routes/user.js",
        "line": 18,
        "code": "db.query(`SELECT * FROM users WHERE id = ${userId}`)",
        "description": "SQL injection via string concatenation",
        "fix_suggestion": "Use parameterized queries with placeholders",
        "confidence": 0.95,
        "cvss_score": 9.8,
        "cwe_id": "CWE-89"
      }
    ],
    "impact": {
      "estimated_savings_usd": 18500,
      "risk_score_total": 24.3
    },
    "overallScore": 42
  }
}
```

## Testing

Run the test suite:

```bash
cd engine
npm test
```

Current test coverage:
- 106 passing tests across 3 suites
- Security rules: 39 tests (OWASP Top 10 coverage)
- Data flow tracker: 35 tests
- Dependency analyzer: 32 tests
- 100% test success rate
- < 1 second total execution time

Tests follow TDD principles with integration-style validation through public interfaces.

## IBM WatsonX Setup

The system works without IBM credentials, but AI remediation requires:

1. Create IBM Cloud account at https://cloud.ibm.com
2. Navigate to "Manage" → "Access (IAM)" → "API keys"
3. Click "Create" and copy the API key
4. Go to https://dataplatform.cloud.ibm.com/wx/home
5. Create or select a project
6. Copy the Project ID from "Manage" → "General"
7. Add credentials to `engine/.env`

Recommended model: `ibm/granite-13b-chat-v2` (best for code analysis)

If authentication fails, the system logs a warning and continues with static analysis only.

## Security

- Never commit `.env` files
- API keys are server-side only (never exposed to frontend)
- Rotate API keys every 90 days
- Use separate keys for dev/staging/production
- Monitor IBM Cloud usage dashboard for unexpected spikes

## Architecture

```
engine/
├── server.js                 # Express server entry point
├── app.js                    # App configuration
├── routes/
│   └── audit.js              # API route definitions
├── controllers/
│   └── auditController.js    # Request handlers
├── services/
│   ├── auditService.js       # Main audit orchestration
│   ├── dataFlowTracker.js    # Cross-file data flow analysis
│   ├── dependencyAnalyzer.js # Dependency graph construction
│   ├── bobOrchestrator.js    # IBM WatsonX integration
│   └── remediation.js        # Fix generation
├── config/
│   └── ibmBobClient.js       # IBM API client
├── middleware/
│   ├── validateRequest.js    # Input validation
│   └── errorHandler.js       # Error middleware
└── security_rules/
    └── index.js              # Vulnerability detection patterns

dashboard/ (optional)
├── src/
│   ├── components/           # React components
│   ├── pages/                # Page containers
│   └── services/             # API client
└── public/                   # Static assets
```

See `ARCHITECTURE.md` for detailed design documentation.

## Troubleshooting

**Engine won't start**
- Check that `engine/.env` exists
- Verify Node.js version (16+)
- Review terminal output for specific errors

**"IBM_CLOUD_API_KEY is not set"**
- This is a warning, not a fatal error
- System falls back to static analysis
- Add credentials to `engine/.env` to enable AI features

**Dashboard shows "Connection Error"**
- Verify engine is running on port 3001
- Check `curl http://localhost:3001/health`
- Review firewall settings

**API returns 401/403**
- Verify IBM API key is correct (no extra spaces)
- Check API key hasn't expired
- Confirm you have credits/quota remaining

## Performance

Benchmark results (100-file repository):
- Dependency graph construction: ~1.2s
- Data flow detection: ~2.5s
- Complete analysis (static): ~4s
- Complete analysis (with AI): ~8s

Memory usage scales with repository size. Expect ~80MB baseline, +500KB per file.

## Contributing

This is a hackathon project. For Team AVON members:

1. Create feature branch from `main`
2. Write tests first (TDD)
3. Implement feature
4. Run full test suite (`npm test`)
5. Submit pull request with test coverage

All commits must pass the test suite. No merge on test failures.

## License

Proprietary - Team AVON, IBM Bob Hackathon 2026

## Team

**Team AVON**  
IBM Bob Hackathon 2026

For questions or support, contact the team through official hackathon channels.
