# CodeGuard AI - Architecture

Technical documentation for the security audit engine.

## System Design

CodeGuard AI is a three-tier static analysis system with optional AI enhancement:

1. **Detection layer** - Pattern-based vulnerability identification
2. **Analysis layer** - Cross-file data flow tracking and dependency analysis
3. **Remediation layer** - Fix generation using IBM WatsonX (optional)

The engine operates in two modes:

- **Standalone mode** - Pure static analysis without external dependencies
- **AI-enhanced mode** - Includes IBM WatsonX for context-aware remediation

Both modes produce identical vulnerability detection results. AI enhancement only affects remediation quality and business impact reporting.

## Core Components

### 1. Audit Service (`engine/services/auditService.js`)

Main orchestration layer. Coordinates all analysis phases.

**Entry point:**
```javascript
async function performAudit(repoFiles) {
  // Phase 1: Build dependency graph
  const dependencyGraph = buildDependencyGraph(repoFiles);
  
  // Phase 2: Detect single-file vulnerabilities
  const staticVulns = detectVulnerabilities(repoFiles);
  
  // Phase 3: Detect cross-file vulnerabilities
  const crossFileVulns = detectCrossFileVulnerabilities(repoFiles, dependencyGraph);
  
  // Phase 4: Score and prioritize
  const scored = calculateRiskScores([...staticVulns, ...crossFileVulns]);
  
  // Phase 5: Generate impact metrics
  const impact = calculateImpact(scored);
  
  return { vulnerabilities: scored, impact, dependencyGraph };
}
```

**Responsibilities:**
- Coordinate analysis phases
- Merge single-file and cross-file results
- Calculate overall security score
- Generate impact metrics

### 2. Security Rules (`security_rules/index.js`)

Pattern-based detection engine. Each vulnerability type has dedicated detection logic.

**Detection functions:**

```javascript
function detectSQLInjection(fileContent, fileName) {
  const patterns = [
    /\.query\s*\(\s*`[^`]*\$\{/,           // Template literals
    /\.query\s*\(\s*['"][^'"]*\s*\+\s*/,   // String concatenation
    /\.execute\s*\(\s*`[^`]*\$\{/          // ORM execute with interpolation
  ];
  
  return findVulnerabilities(fileContent, fileName, patterns, {
    type: 'SQL_INJECTION',
    severity: 'CRITICAL',
    cwe: 'CWE-89',
    cvss: 9.8,
    fix: 'Use parameterized queries'
  });
}
```

**Current detectors:**
- `detectSQLInjection()` - SQL query construction patterns
- `detectNoSQLInjection()` - MongoDB $where and $regex patterns
- `detectCommandInjection()` - exec, spawn, shell=true
- `detectXSS()` - innerHTML, document.write, dangerouslySetInnerHTML
- `detectWeakCrypto()` - MD5, SHA1, weak random
- `detectHardcodedSecrets()` - Hardcoded passwords, API keys
- `detectSSRF()` - Unvalidated URL fetching
- `detectCodeInjection()` - eval, Function constructor
- `detectAuthFailures()` - Missing auth, weak passwords
- `detectMisconfig()` - CORS wildcards, disabled SSL

Each detector returns:
```javascript
{
  type: 'VULNERABILITY_TYPE',
  severity: 'CRITICAL|HIGH|MEDIUM|LOW',
  file: 'path/to/file.js',
  line: 42,
  code: 'vulnerable code snippet',
  description: 'Human-readable explanation',
  fix_suggestion: 'Concrete remediation steps',
  confidence: 0.95,
  cwe_id: 'CWE-XXX',
  cvss_score: 9.8
}
```

**Confidence scoring:**

Confidence values indicate detection accuracy:
- **0.9-1.0** - Definite vulnerability (exact pattern match)
- **0.7-0.9** - High confidence (context-supported)
- **0.5-0.7** - Medium confidence (pattern match, needs review)
- **0.3-0.5** - Low confidence (potential false positive)

### 3. Data Flow Tracker (`engine/services/dataFlowTracker.js`)

Traces tainted data from sources (user input) to sinks (dangerous operations) across file boundaries.

**Algorithm:**

1. Identify all data sources in the codebase
2. Identify all data sinks in the codebase
3. For each source-sink pair in different files:
   - Use dependency graph to find possible paths
   - Check if path includes sanitization
   - Calculate risk level based on severity and sanitization
4. Generate vulnerability report for unsanitized flows

**Data sources:**
```javascript
const DATA_SOURCES = {
  'req.body': 'REQUEST_BODY',
  'req.query': 'REQUEST_QUERY',
  'req.params': 'REQUEST_PARAMS',
  'req.headers': 'REQUEST_HEADERS',
  'req.cookies': 'REQUEST_COOKIES'
};
```

**Data sinks:**
```javascript
const DATA_SINKS = {
  '.query(': { type: 'SQL_QUERY', severity: 'CRITICAL' },
  '.execute(': { type: 'SQL_QUERY', severity: 'CRITICAL' },
  'exec(': { type: 'COMMAND_EXEC', severity: 'CRITICAL' },
  'spawn(': { type: 'COMMAND_EXEC', severity: 'CRITICAL' },
  'eval(': { type: 'CODE_INJECTION', severity: 'CRITICAL' },
  '.innerHTML': { type: 'XSS', severity: 'HIGH' },
  'document.write(': { type: 'XSS', severity: 'HIGH' },
  'fs.readFile(': { type: 'PATH_TRAVERSAL', severity: 'HIGH' },
  '.find({': { type: 'NOSQL_QUERY', severity: 'HIGH' }
};
```

**Sanitization detection:**
```javascript
const SANITIZERS = [
  'escape', 'sanitize', 'validate', 'clean',
  'parseInt', 'parseFloat', 'Number',
  'encodeURIComponent', 'encodeURI',
  'validator.escape', 'DOMPurify.sanitize'
];
```

If a data flow path includes any sanitizer, risk is downgraded from CRITICAL to MEDIUM.

**Example cross-file vulnerability:**

File 1 (`routes/user.js`):
```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;  // DATA SOURCE
  userService.getUser(userId);   // Pass to another file
});
```

File 2 (`services/userService.js`):
```javascript
async function getUser(id) {
  return db.query(`SELECT * FROM users WHERE id = ${id}`);  // DATA SINK
}
```

Data flow tracker identifies:
- Source: `req.params.id` in `routes/user.js:2`
- Sink: `db.query` in `services/userService.js:2`
- Path: routes/user.js → services/userService.js
- Sanitization: None
- Risk: CRITICAL

### 4. Dependency Analyzer (`engine/services/dependencyAnalyzer.js`)

Constructs a directed graph of file dependencies and function calls.

**Graph structure:**
```javascript
{
  nodes: [
    { file: 'routes/user.js', exports: ['router'], imports: ['../services/userService'] },
    { file: 'services/userService.js', exports: ['getUser', 'createUser'], imports: ['../db'] }
  ],
  edges: [
    { from: 'routes/user.js', to: 'services/userService.js', type: 'require' }
  ],
  fileMap: {
    'routes/user.js': { /* node data */ },
    'services/userService.js': { /* node data */ }
  }
}
```

**Extraction logic:**

Imports:
```javascript
function extractImports(content) {
  const patterns = [
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,           // const x = require('y')
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)\s*\.\s*(\w+)/g,  // require('y').method
    /import\s+.*\s+from\s+['"]([^'"]+)['"]/g,         // import x from 'y'
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g            // import('y')
  ];
  // ... extraction logic
}
```

Exports:
```javascript
function extractExports(content) {
  const patterns = [
    /module\.exports\s*=\s*\{([^}]+)\}/,              // module.exports = { x, y }
    /module\.exports\.(\w+)/g,                        // module.exports.x = ...
    /export\s+default\s+(\w+)/,                       // export default x
    /export\s+\{([^}]+)\}/,                           // export { x, y }
    /export\s+(?:const|let|var|function)\s+(\w+)/g   // export const x = ...
  ];
  // ... extraction logic
}
```

**Function call tracing:**

```javascript
function traceFunctionCall(functionName, startFile, graph) {
  const visited = new Set();
  const callChain = [];
  
  function trace(currentFile, targetFunction) {
    if (visited.has(currentFile)) return null;  // Prevent cycles
    visited.add(currentFile);
    
    const node = graph.fileMap[currentFile];
    
    // Check if function is defined in this file
    if (node.functions.includes(targetFunction)) {
      return [{ file: currentFile, function: targetFunction }];
    }
    
    // Check dependencies
    for (const dep of node.imports) {
      const depPath = resolvePath(currentFile, dep);
      const result = trace(depPath, targetFunction);
      if (result) {
        return [{ file: currentFile }, ...result];
      }
    }
    
    return null;
  }
  
  return trace(startFile, functionName);
}
```

This enables the data flow tracker to follow function calls across file boundaries.

### 5. Bob Orchestrator (`engine/services/bobOrchestrator.js`)

Coordinates IBM WatsonX AI integration for enhanced analysis. Falls back gracefully if IBM API is unavailable.

**Analysis workflow:**

```javascript
async function runCompleteAnalysis(repoFiles) {
  try {
    // Step 1: Analyze repository structure
    const structure = await analyzeRepositoryStructure(repoFiles);
    
    // Step 2: Detect cross-file vulnerabilities (with AI context)
    const vulnerabilities = await detectCrossFileVulnerabilities(repoFiles, structure);
    
    // Step 3: Generate remediation strategy
    const remediation = await generateRemediationStrategy(vulnerabilities);
    
    // Step 4: Create business impact report
    const impact = await generateImpactReport(vulnerabilities, remediation);
    
    return {
      structure,
      vulnerabilities,
      remediation,
      impact,
      metadata: { bobApiUsed: true }
    };
  } catch (error) {
    console.warn('[Bob] AI analysis failed, falling back to static analysis:', error.message);
    return runStaticAnalysisFallback(repoFiles);
  }
}
```

**Severity fallback cascade:**

The remediation generator prioritizes vulnerabilities by severity:

```javascript
function generateRemediationStrategy(vulnerabilities) {
  // Try CRITICAL + HIGH first
  let targetVulns = vulnerabilities.filter(v => 
    v.severity === 'CRITICAL' || v.severity === 'HIGH'
  ).slice(0, 5);
  
  // Fallback to MEDIUM if no CRITICAL/HIGH
  if (targetVulns.length === 0) {
    targetVulns = vulnerabilities.filter(v => v.severity === 'MEDIUM').slice(0, 5);
  }
  
  // Fallback to all vulnerabilities if no MEDIUM
  if (targetVulns.length === 0) {
    targetVulns = vulnerabilities.slice(0, 5);
  }
  
  return generateFixPlans(targetVulns);
}
```

This ensures remediation plans are generated even when only low-severity issues exist.

**Prompt engineering:**

Prompts are stored in `engine/prompts/bobPrompts.js`:

```javascript
const PROMPTS = {
  ANALYZE_STRUCTURE: `Analyze this codebase structure and identify the main entry points, 
                      authentication mechanisms, and data flow patterns. Focus on security-relevant 
                      architecture. Return JSON only.`,
  
  DETECT_VULNERABILITIES: `Given this code context and dependency graph, identify security 
                           vulnerabilities that span multiple files. Focus on: SQL injection, 
                           command injection, XSS, SSRF, privilege escalation. Return JSON with 
                           vulnerability type, affected files, data flow path, and risk level.`,
  
  GENERATE_REMEDIATION: `For each vulnerability, provide: (1) Concrete code fix with before/after, 
                         (2) Test cases to verify the fix, (3) Estimated effort in hours, 
                         (4) Priority ranking. Return JSON only.`
};
```

Prompts are optimized for IBM Granite models. They emphasize structured JSON output to avoid parsing issues.

### 6. IBM Bob Client (`engine/config/ibmBobClient.js`)

Handles authentication and API communication with IBM WatsonX.

**Fail-fast validation:**

```javascript
constructor() {
  this.apiKey = process.env.IBM_CLOUD_API_KEY;
  this.projectId = process.env.WATSONX_PROJECT_ID;
  this.url = process.env.IBM_CLOUD_URL || 'https://us-south.ml.cloud.ibm.com';
  this.modelId = process.env.MODEL_ID || 'ibm/granite-13b-chat-v2';
  
  // Fail-fast: Check for required API key at initialization
  if (!this.apiKey) {
    console.error('[IBM] FATAL: IBM_CLOUD_API_KEY not set');
    console.error('[IBM] The system will fall back to static analysis only');
    console.error('[IBM] Set IBM_CLOUD_API_KEY in .env to enable AI features');
    // Do NOT call process.exit() - allow graceful degradation
  }
  
  this.accessToken = null;
  this.tokenExpiry = null;
}
```

**Token management:**

```javascript
async function getAccessToken() {
  // Check if current token is still valid
  if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
    return this.accessToken;
  }
  
  // Request new token
  const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${this.apiKey}`
  });
  
  const data = await response.json();
  this.accessToken = data.access_token;
  this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;  // 1min buffer
  
  return this.accessToken;
}
```

**API call:**

```javascript
async function generateText(prompt, options = {}) {
  const token = await this.getAccessToken();
  
  const response = await fetch(`${this.url}/ml/v1/text/generation?version=2024-03-19`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      model_id: this.modelId,
      input: prompt,
      parameters: {
        max_new_tokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.1,
        top_p: options.topP || 0.95,
        repetition_penalty: 1.1
      },
      project_id: this.projectId
    })
  });
  
  const data = await response.json();
  return data.results[0].generated_text;
}
```

Temperature is set to 0.1 for deterministic, focused output. Higher values produce more creative but less consistent results.

## Scoring Algorithms

### Security Score (0-100)

```javascript
function calculateSecurityScore(vulnerabilities) {
  const SEVERITY_WEIGHTS = {
    CRITICAL: 30,
    HIGH: 15,
    MEDIUM: 7,
    LOW: 2
  };
  
  let totalDeductions = 0;
  
  for (const vuln of vulnerabilities) {
    const severity = vuln.severity?.toUpperCase();
    const weight = SEVERITY_WEIGHTS[severity] || 0;
    const confidenceFactor = vuln.confidence || 1.0;
    totalDeductions += weight * confidenceFactor;
  }
  
  const rawScore = 100 - totalDeductions;
  return Math.max(0, Math.min(100, rawScore));
}
```

**Grade mapping:**
- 90-100: A (Excellent)
- 80-89: B (Good)
- 70-79: C (Acceptable)
- 60-69: D (Needs Improvement)
- 0-59: F (Critical Issues)

### CVSS Scoring

Each vulnerability includes a CVSS 3.1 score based on:
- Attack Vector (AV)
- Attack Complexity (AC)
- Privileges Required (PR)
- User Interaction (UI)
- Scope (S)
- Confidentiality Impact (C)
- Integrity Impact (I)
- Availability Impact (A)

Example mappings:
```javascript
const CVSS_SCORES = {
  'SQL_INJECTION': 9.8,        // AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
  'COMMAND_INJECTION': 9.8,    // AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
  'XSS': 7.3,                   // AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N
  'WEAK_CRYPTO': 7.4,           // AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N
  'MISSING_AUTH': 8.1           // AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N
};
```

### Impact Calculation

```javascript
function calculateImpact(vulnerabilities) {
  const BASE_COST = {
    CRITICAL: 150000,  // Average cost of a critical breach
    HIGH: 40000,
    MEDIUM: 10000,
    LOW: 1500
  };
  
  const LIKELIHOOD = {
    CRITICAL: 0.8,     // 80% chance of exploitation
    HIGH: 0.5,
    MEDIUM: 0.2,
    LOW: 0.05
  };
  
  let totalRisk = 0;
  let estimatedCost = 0;
  
  for (const vuln of vulnerabilities) {
    const severity = vuln.severity?.toUpperCase();
    const cost = BASE_COST[severity] || 0;
    const likelihood = LIKELIHOOD[severity] || 0;
    
    const riskValue = cost * likelihood * (vuln.confidence || 1.0);
    totalRisk += riskValue;
    estimatedCost += cost;
  }
  
  return {
    estimated_savings_usd: Math.round(totalRisk),
    worst_case_cost_usd: estimatedCost,
    risk_score_total: totalRisk / 10000  // Normalized for display
  };
}
```

This produces business metrics for stakeholder reporting.

## API Reference

### POST /api/v1/audit

Run security audit on provided files.

**Request:**
```json
{
  "files": [
    {
      "file": "routes/user.js",
      "content": "const express = require('express');\n..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vulnerabilities": [
      {
        "type": "SQL_INJECTION",
        "severity": "CRITICAL",
        "file": "routes/user.js",
        "line": 42,
        "code": "db.query(`SELECT * FROM users WHERE id = ${userId}`)",
        "description": "SQL injection vulnerability detected",
        "fix_suggestion": "Use parameterized queries",
        "confidence": 0.95,
        "cwe_id": "CWE-89",
        "cvss_score": 9.8
      }
    ],
    "summary": {
      "total": 5,
      "critical": 2,
      "high": 2,
      "medium": 1,
      "low": 0
    },
    "impact": {
      "estimated_savings_usd": 18500,
      "risk_score_total": 24.3
    },
    "overallScore": 42,
    "auditTimestamp": "2024-05-01T18:00:00.000Z"
  }
}
```

### POST /api/v1/audit/remediation

Run audit with AI-powered remediation (requires IBM credentials).

**Request:**
```json
{
  "files": [
    {
      "file": "routes/user.js",
      "content": "..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vulnerabilities": [...],
    "summary": {...},
    "impact": {...},
    "remediation": {
      "total_items": 5,
      "estimated_effort_minutes": 150,
      "items": [
        {
          "vulnerability_id": "routes/user.js:42",
          "type": "SQL_INJECTION",
          "severity": "CRITICAL",
          "priority": 1,
          "estimated_time_minutes": 30,
          "bob_prompt": "Fix SQL injection in routes/user.js line 42...",
          "test_cases": [
            "Test with malicious input: 1' OR '1'='1",
            "Verify parameterized query works correctly"
          ]
        }
      ]
    }
  }
}
```

### GET /api/v1/demo

Demo scan with pre-loaded vulnerable code.

**Response:**
```json
{
  "success": true,
  "data": {
    "vulnerabilities": [...],
    "summary": {...},
    "impact": {...}
  },
  "note": "Demo results using mock vulnerable code"
}
```

### GET /api/v1/vulnerabilities/:severity

Filter vulnerabilities by severity level.

**Parameters:**
- `severity`: CRITICAL | HIGH | MEDIUM | LOW

**Response:**
```json
{
  "success": true,
  "data": {
    "severity": "CRITICAL",
    "count": 2,
    "vulnerabilities": [...]
  }
}
```

### GET /api/v1/metrics

Time-saved and efficiency metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_vulnerabilities": 5,
    "manual_review_time_minutes": 75,
    "automated_scan_time_minutes": 2,
    "time_saved_minutes": 73,
    "time_saved_hours": 1.2,
    "efficiency_improvement": "97%"
  }
}
```

Manual review time is estimated at 15 minutes per vulnerability for thorough code review. Automated scan time is measured in real-time.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional context"
}
```

**Common errors:**

- **400 Bad Request** - Invalid request body or missing required fields
- **404 Not Found** - Endpoint or resource not found
- **500 Internal Server Error** - Server-side error (logged for debugging)

Middleware stack:
1. `validateAuditRequest()` - Validates request body structure
2. Route handler - Business logic
3. `errorHandler()` - Catches and formats errors

Example validation:
```javascript
function validateAuditRequest(req, res, next) {
  if (!req.body.files || !Array.isArray(req.body.files)) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: 'Request body must contain "files" array'
    });
  }
  
  for (const file of req.body.files) {
    if (!file.file || !file.content) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file format',
        details: 'Each file must have "file" and "content" properties'
      });
    }
  }
  
  next();
}
```

## Performance Optimization

### 1. Dependency Graph Caching

Dependency graphs are expensive to build but rarely change between scans. Cache them:

```javascript
const graphCache = new Map();

function getCachedGraph(repoHash) {
  if (graphCache.has(repoHash)) {
    return graphCache.get(repoHash);
  }
  
  const graph = buildDependencyGraph(repoFiles);
  graphCache.set(repoHash, graph);
  return graph;
}
```

### 2. Parallel File Processing

Process independent files concurrently:

```javascript
async function detectVulnerabilities(repoFiles) {
  const results = await Promise.all(
    repoFiles.map(file => detectSingleFile(file))
  );
  return results.flat();
}
```

### 3. Early Exit on High-Severity Findings

For CI/CD integration, exit early when critical issues are found:

```javascript
async function performAuditWithEarlyExit(repoFiles, exitOnCritical = false) {
  const vulnerabilities = [];
  
  for (const file of repoFiles) {
    const vulns = await detectSingleFile(file);
    vulnerabilities.push(...vulns);
    
    if (exitOnCritical) {
      const hasCritical = vulns.some(v => v.severity === 'CRITICAL');
      if (hasCritical) {
        return { vulnerabilities, exitedEarly: true };
      }
    }
  }
  
  return { vulnerabilities, exitedEarly: false };
}
```

### 4. Memory Management

Large codebases can exhaust memory. Process files in batches:

```javascript
async function processLargeRepository(repoFiles, batchSize = 50) {
  const results = [];
  
  for (let i = 0; i < repoFiles.length; i += batchSize) {
    const batch = repoFiles.slice(i, i + batchSize);
    const batchResults = await processBatch(batch);
    results.push(...batchResults);
    
    // Allow garbage collection between batches
    if (global.gc) global.gc();
  }
  
  return results;
}
```

Run Node.js with `--expose-gc` to enable manual garbage collection.

## Testing Strategy

Tests follow TDD principles with integration-style validation.

### Test Structure

```javascript
describe('Security Rules', () => {
  describe('SQL Injection Detection', () => {
    test('detects template literal injection', () => {
      const code = `db.query(\`SELECT * FROM users WHERE id = \${userId}\`)`;
      const vulns = detectSQLInjection(code, 'test.js');
      
      expect(vulns).toHaveLength(1);
      expect(vulns[0].type).toBe('SQL_INJECTION');
      expect(vulns[0].severity).toBe('CRITICAL');
    });
    
    test('allows parameterized queries', () => {
      const code = `db.query('SELECT * FROM users WHERE id = ?', [userId])`;
      const vulns = detectSQLInjection(code, 'test.js');
      
      expect(vulns).toHaveLength(0);
    });
  });
});
```

### Mock Data

Test data is stored in `__tests__/fixtures/`:

```javascript
const vulnerableCode = {
  sqlInjection: `
    app.get('/user/:id', (req, res) => {
      const userId = req.params.id;
      db.query(\`SELECT * FROM users WHERE id = \${userId}\`);
    });
  `,
  
  safeCode: `
    app.get('/user/:id', (req, res) => {
      const userId = req.params.id;
      db.query('SELECT * FROM users WHERE id = ?', [userId]);
    });
  `
};
```

### Coverage Goals

- Unit tests: 80%+ line coverage
- Integration tests: All API endpoints
- Edge cases: Empty files, malformed input, circular dependencies
- Performance: Benchmarks for large repositories

Current coverage:
- Security rules: 39 tests, 100% passing
- Data flow tracker: 35 tests, 100% passing
- Dependency analyzer: 32 tests, 100% passing

## Deployment

### Production Configuration

```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=warn

# IBM WatsonX (optional)
IBM_CLOUD_API_KEY=xxx
WATSONX_PROJECT_ID=xxx
IBM_CLOUD_URL=https://us-south.ml.cloud.ibm.com
MODEL_ID=ibm/granite-13b-chat-v2

# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Process Management

Use PM2 for process management:

```bash
npm install -g pm2

# Start
pm2 start engine/server.js --name codeguard-engine

# Monitor
pm2 monit

# Logs
pm2 logs codeguard-engine

# Restart
pm2 restart codeguard-engine
```

### Health Monitoring

Health endpoint includes:
- Service status
- Uptime
- Memory usage
- Active connections

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '3.0'
  });
});
```

Set up monitoring with cron:

```bash
*/5 * * * * curl -f http://localhost:3001/health || systemctl restart codeguard
```

## Security Considerations

### API Key Protection

- Never commit `.env` files
- Use environment variables in production
- Rotate keys every 90 days
- Use separate keys per environment
- Monitor IBM Cloud usage for anomalies

### Input Validation

All file inputs are validated:
- Maximum file size: 10MB per file
- Maximum files per request: 100
- Allowed extensions: .js, .ts, .jsx, .tsx, .py, .rb, .php
- Content sanitization: Strip null bytes, control characters

### Rate Limiting

Protect against abuse with rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Extension Points

### Adding New Vulnerability Detectors

1. Create detection function in `security_rules/index.js`:

```javascript
function detectNewVulnerability(fileContent, fileName) {
  const pattern = /dangerous-pattern/g;
  
  return findVulnerabilities(fileContent, fileName, [pattern], {
    type: 'NEW_VULNERABILITY',
    severity: 'HIGH',
    cwe: 'CWE-XXX',
    cvss: 7.5,
    fix: 'How to fix this issue'
  });
}
```

2. Add to main detection function:

```javascript
const allDetectors = [
  detectSQLInjection,
  detectCommandInjection,
  detectNewVulnerability  // Add here
];
```

3. Write tests:

```javascript
describe('New Vulnerability Detection', () => {
  test('detects dangerous pattern', () => {
    const code = 'dangerous-pattern';
    const vulns = detectNewVulnerability(code, 'test.js');
    expect(vulns).toHaveLength(1);
  });
});
```

### Custom Output Formats

Add new formatters in `engine/services/formatResponse.js`:

```javascript
function formatAsHTML(auditResults) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>Security Audit Report</title></head>
      <body>
        <h1>Vulnerabilities: ${auditResults.vulnerabilities.length}</h1>
        ...
      </body>
    </html>
  `;
  return html;
}
```

### Integration with CI/CD

Example GitHub Actions workflow:

```yaml
name: Security Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run CodeGuard AI
        run: |
          cd engine
          npm install
          node scripts/ci-audit.js
        
      - name: Upload Results
        uses: actions/upload-artifact@v2
        with:
          name: security-report
          path: audit-results.json
```

CI script example:

```javascript
// scripts/ci-audit.js
const { performAudit } = require('./services/auditService');
const fs = require('fs');

async function runCIAudit() {
  const repoFiles = loadRepositoryFiles();
  const results = await performAudit(repoFiles);
  
  fs.writeFileSync('audit-results.json', JSON.stringify(results, null, 2));
  
  const criticalCount = results.vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
  
  if (criticalCount > 0) {
    console.error(`FAIL: ${criticalCount} critical vulnerabilities found`);
    process.exit(1);
  }
  
  console.log('PASS: No critical vulnerabilities found');
  process.exit(0);
}

runCIAudit().catch(console.error);
```

## Troubleshooting

### Common Issues

**High memory usage**
- Reduce batch size in `processLargeRepository()`
- Enable garbage collection with `--expose-gc`
- Limit concurrent file processing

**Slow scans**
- Cache dependency graphs
- Use early exit for CI/CD
- Profile with `node --prof`

**False positives**
- Adjust confidence thresholds
- Add sanitization patterns
- Review detection regex patterns

**IBM API errors**
- Check API key validity
- Verify network connectivity
- Review rate limits in IBM Cloud dashboard
- Check token expiry (automatically handled)

### Debug Logging

Enable debug logging:

```bash
DEBUG=codeguard:* node server.js
```

Add debug statements:

```javascript
const debug = require('debug')('codeguard:audit');

debug('Starting audit for %d files', repoFiles.length);
debug('Dependency graph has %d nodes', graph.nodes.length);
```

### Performance Profiling

Profile CPU usage:

```bash
node --prof server.js
node --prof-process isolate-*.log > profile.txt
```

Profile memory:

```bash
node --inspect server.js
# Open chrome://inspect in Chrome
# Take heap snapshots before and after scan
```

## Changelog

### Version 3.0 (Current)

- Added cross-file vulnerability detection
- Integrated IBM WatsonX for AI remediation
- Implemented dependency graph analysis
- Added data flow tracking with taint analysis
- Comprehensive test suite (106 tests)
- Fail-fast validation for missing credentials
- Severity fallback cascade for remediation

### Version 2.0

- Enhanced detection patterns
- Added CVSS scoring
- Improved scoring algorithm with case-insensitive severity handling
- Business impact metrics

### Version 1.0

- Initial release
- Basic pattern-based detection
- 29 vulnerability types
- REST API endpoints

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- CWE Database: https://cwe.mitre.org/
- CVSS Calculator: https://www.first.org/cvss/calculator/3.1
- IBM WatsonX Documentation: https://cloud.ibm.com/docs/watsonx
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/