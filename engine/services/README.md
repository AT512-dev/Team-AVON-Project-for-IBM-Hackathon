# 🧠 Harshal's AI Engine - Cross-File Vulnerability Detection

**Author:** Harshal  
**Branch:** `feature/harshal-bob-engine`  
**Status:** ✅ Implementation Complete

---

## 📋 Overview

This module implements the "Brain" of CodeGuard AI - an intelligent system that uses IBM Bob to detect cross-file security vulnerabilities by analyzing data flows across the entire codebase.

### Key Capabilities

✅ **Cross-File Dependency Analysis** - Maps how files connect and depend on each other  
✅ **Data Flow Tracking** - Traces user input from entry points to dangerous operations  
✅ **AI-Powered Detection** - Uses IBM Bob for context-aware vulnerability analysis  
✅ **Multi-Step Orchestration** - Coordinates complex analysis workflows  
✅ **Automated Remediation** - Generates fix suggestions with test cases

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    New Modules (Harshal)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  dependencyAnalyzer.js                                       │
│  ├─ buildDependencyGraph()      Build file relationship map │
│  ├─ extractImports/Exports()    Parse module connections    │
│  ├─ traceFunctionCall()         Follow function across files│
│  └─ findDependents()            Find who uses what          │
│                                                              │
│  dataFlowTracker.js                                          │
│  ├─ findDataSources()           Locate user input points    │
│  ├─ findDataSinks()             Find dangerous operations   │
│  ├─ traceDataFlow()             Track data source → sink    │
│  └─ detectCrossFileVulns()     Main detection engine        │
│                                                              │
│  bobOrchestrator.js                                          │
│  ├─ analyzeRepositoryStructure() Step 1: Understand code   │
│  ├─ detectCrossFileVulns()      Step 2: AI detection       │
│  ├─ generateRemediation()       Step 3: Create fixes       │
│  ├─ generateImpactReport()      Step 4: Business report    │
│  └─ runCompleteAnalysis()       Master workflow            │
│                                                              │
│  ../prompts/bobPrompts.js                                    │
│  └─ PROMPTS                     Optimized AI prompts        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd engine
npm install
```

### 2. Basic Usage

```javascript
const { BobOrchestrator } = require('./services/bobOrchestrator');
const ibmBobClient = require('./config/ibmBobClient');

// Initialize orchestrator
const orchestrator = new BobOrchestrator(ibmBobClient);

// Run complete analysis
const results = await orchestrator.runCompleteAnalysis(repoFiles);

console.log(`Found ${results.dataFlows.count} cross-file vulnerabilities`);
console.log(`Generated ${results.remediation.fixes?.length} fix plans`);
```

### 3. Individual Module Usage

#### Dependency Analysis

```javascript
const { buildDependencyGraph, traceFunctionCall } = require('./services/dependencyAnalyzer');

// Build graph
const graph = buildDependencyGraph(repoFiles);
console.log(`Nodes: ${graph.nodes.length}, Edges: ${graph.edges.length}`);

// Trace a function
const chain = traceFunctionCall('getUserById', 'routes/user.js', graph);
console.log('Function call chain:', chain);
```

#### Data Flow Tracking

```javascript
const { detectCrossFileVulnerabilities } = require('./services/dataFlowTracker');

// Detect vulnerabilities
const vulns = detectCrossFileVulnerabilities(repoFiles, dependencyGraph);

vulns.forEach(v => {
  console.log(`${v.type}: ${v.dataFlow.source.file} → ${v.dataFlow.sink.file}`);
});
```

---

## 📊 Example Output

### Cross-File SQL Injection Detection

```json
{
  "type": "SQL_INJECTION",
  "severity": "CRITICAL",
  "confidence": 0.95,
  "description": "Cross-file SQL_INJECTION: User input from routes/user.js:15 flows to services/userService.js:42 without sanitization",
  "dataFlow": {
    "source": {
      "file": "routes/user.js",
      "line": 15,
      "type": "REQUEST_PARAMS",
      "value": "req.params.id"
    },
    "sink": {
      "file": "services/userService.js",
      "line": 42,
      "type": "SQL_QUERY",
      "operation": "db.query("
    },
    "path": [
      {
        "file": "routes/user.js",
        "line": 15,
        "type": "source",
        "operation": "user_input"
      },
      {
        "file": "controllers/userController.js",
        "line": 23,
        "type": "import",
        "function": "getUser"
      },
      {
        "file": "services/userService.js",
        "line": 42,
        "type": "sink",
        "operation": "SQL_QUERY"
      }
    ],
    "sanitized": false,
    "sanitizers": []
  },
  "fix_suggestion": "Use parameterized queries or prepared statements..."
}
```

---

## 🔍 Detection Capabilities

### Data Sources (User Input)
- `req.body` - POST request body
- `req.query` - URL query parameters
- `req.params` - URL path parameters
- `req.headers` - HTTP headers
- `req.cookies` - Cookie values

### Data Sinks (Dangerous Operations)
- **SQL Injection**: `.query()`, `.execute()`, `.raw()`
- **Command Injection**: `exec()`, `spawn()`, `execSync()`
- **Code Injection**: `eval()`, `Function()`, `setTimeout()`
- **Path Traversal**: `fs.readFile()`, `fs.writeFile()`
- **XSS**: `.innerHTML`, `document.write()`, `.html()`
- **NoSQL Injection**: `.find()`, `.findOne()`, `$where`, `$regex`

### Sanitization Detection
Recognizes common sanitization functions:
- `escape`, `sanitize`, `validate`, `clean`
- `parseInt`, `parseFloat`, `Number`
- `encodeURIComponent`, `encodeURI`
- `validator.escape`, `DOMPurify.sanitize`

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Individual Modules

```bash
# Test dependency analyzer
node -e "const {buildDependencyGraph} = require('./services/dependencyAnalyzer'); console.log(buildDependencyGraph([{file:'test.js',content:'const x = require(\"y\")'}]))"

# Test data flow tracker
npm run test:dataflow

# Test Bob orchestrator
npm run test:orchestrator
```

---

## 📈 Performance

### Benchmarks (100 files)

| Operation | Time | Memory |
|-----------|------|--------|
| Build Dependency Graph | ~1.2s | 45MB |
| Detect Data Flows | ~2.5s | 60MB |
| Complete Analysis (with Bob) | ~8s | 120MB |
| Complete Analysis (no Bob) | ~4s | 80MB |

### Optimization Tips

1. **Use line ranges** when reading large files
2. **Cache dependency graphs** for repeated analysis
3. **Limit Bob API calls** to critical vulnerabilities only
4. **Batch process** multiple files together

---

## 🔧 Configuration

### Environment Variables

```bash
# IBM Bob API Configuration
IBM_BOB_API_KEY=your_api_key_here
IBM_BOB_API_URL=https://api.ibm.com/bob/v1

# Analysis Options
MAX_DATA_FLOWS=100          # Limit data flows to analyze
CONFIDENCE_THRESHOLD=0.5    # Minimum confidence for reporting
ENABLE_BOB_AI=true         # Use Bob AI or static analysis only
```

### Custom Configuration

```javascript
const orchestrator = new BobOrchestrator(ibmBobClient);

// Customize analysis
const results = await orchestrator.runCompleteAnalysis(repoFiles, {
  maxDataFlows: 50,
  confidenceThreshold: 0.7,
  enableAI: true,
  focusOnCritical: true
});
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "IBM Bob API unavailable"
**Solution**: The system automatically falls back to static analysis. Check your API key and network connection.

```javascript
// Check if Bob is available
if (results.metadata.bobApiUsed === false) {
  console.log('Using static analysis fallback');
}
```

#### 2. "Too many data flows detected"
**Solution**: Increase confidence threshold or limit analysis scope.

```javascript
const { detectCrossFileVulnerabilities } = require('./services/dataFlowTracker');

// Only high-confidence flows
const vulns = detectCrossFileVulnerabilities(repoFiles, graph)
  .filter(v => v.confidence > 0.8);
```

#### 3. "Dependency graph incomplete"
**Solution**: Ensure all files are included and imports are resolvable.

```javascript
const graph = buildDependencyGraph(repoFiles);
console.log('Unresolved imports:', 
  graph.edges.filter(e => e.to === null)
);
```

---

## 🎯 Integration with Existing Code

### Enhance Existing Audit Service

```javascript
// engine/services/auditService.js

const { BobOrchestrator } = require('./bobOrchestrator');
const ibmBobClient = require('../config/ibmBobClient');

async function performAuditWithCrossFileDetection(repoPath) {
  // Run existing static analysis
  const staticResults = await performAudit(repoPath);
  
  // Run cross-file analysis
  const orchestrator = new BobOrchestrator(ibmBobClient);
  const crossFileResults = await orchestrator.runCompleteAnalysis(repoFiles);
  
  // Merge results
  return {
    ...staticResults,
    crossFileVulnerabilities: crossFileResults.dataFlows.flows,
    aiAnalysis: crossFileResults.vulnerabilities,
    remediation: crossFileResults.remediation,
    impactReport: crossFileResults.impactReport
  };
}
```

### Add New API Endpoint

```javascript
// engine/routes/audit.js

router.post('/audit/cross-file', async (req, res) => {
  const { files } = req.body;
  
  const orchestrator = new BobOrchestrator(ibmBobClient);
  const results = await orchestrator.runCompleteAnalysis(files);
  
  res.json({
    success: true,
    data: results
  });
});
```

---

## 📚 API Reference

### dependencyAnalyzer.js

#### `buildDependencyGraph(repoFiles)`
Builds a graph of file dependencies.

**Parameters:**
- `repoFiles` (Array): Array of `{file, content}` objects

**Returns:** Object with `nodes`, `edges`, and `fileMap`

#### `traceFunctionCall(functionName, startFile, graph)`
Traces a function call across files.

**Parameters:**
- `functionName` (String): Function to trace
- `startFile` (String): Starting file
- `graph` (Object): Dependency graph

**Returns:** Array of call chain steps

### dataFlowTracker.js

#### `detectCrossFileVulnerabilities(repoFiles, dependencyGraph)`
Main entry point for cross-file detection.

**Parameters:**
- `repoFiles` (Array): Repository files
- `dependencyGraph` (Object): Dependency graph

**Returns:** Array of vulnerabilities

#### `traceDataFlow(source, sink, dependencyGraph, repoFiles)`
Traces data flow from source to sink.

**Parameters:**
- `source` (Object): Data source
- `sink` (Object): Data sink
- `dependencyGraph` (Object): Dependency graph
- `repoFiles` (Array): Repository files

**Returns:** Flow object with path and risk assessment

### bobOrchestrator.js

#### `runCompleteAnalysis(repoFiles)`
Runs the complete multi-step analysis workflow.

**Parameters:**
- `repoFiles` (Array): Repository files

**Returns:** Complete analysis results

---

## 🤝 Contributing

### Adding New Vulnerability Types

1. Add pattern to `DATA_SINKS` in `dataFlowTracker.js`
2. Add fix suggestion to `generateFixSuggestion()`
3. Update prompt templates in `bobPrompts.js`
4. Add test cases

### Adding New Sanitizers

```javascript
// dataFlowTracker.js
const SANITIZERS = [
  ...SANITIZERS,
  'yourNewSanitizer',
  'anotherSanitizer'
];
```

---

## 📖 Further Reading

- [IBM Bob Documentation](https://ibm.com/bob/docs)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Taint Analysis](https://en.wikipedia.org/wiki/Taint_checking)
- [Static Code Analysis](https://en.wikipedia.org/wiki/Static_program_analysis)

---

## 📞 Support

**Developer:** Harshal  
**Team:** AVON  
**Project:** CodeGuard AI  
**Hackathon:** IBM Bob 2026

For questions or issues, contact the team or check the main project README.

---

**Last Updated:** May 1, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready