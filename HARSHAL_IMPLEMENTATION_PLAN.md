# 🧠 Harshal's AI Engine Implementation Plan
## CodeGuard AI - IBM Bob Integration & Prompt Orchestration

**Developer:** Harshal  
**Role:** AI Engine & Bob Integration Lead  
**Date:** May 1, 2026  
**Status:** Planning Phase

---

## 📋 Executive Summary

This document outlines the complete implementation plan for building the "Brain" of CodeGuard AI - the prompt orchestration system that leverages IBM Bob's capabilities to detect cross-file vulnerabilities and data flow issues.

### Your Core Mission
Build the NLP-powered prompt orchestration engine that enables Bob to:
1. **Understand cross-file dependencies** (e.g., route → controller → database)
2. **Detect data flow vulnerabilities** (unvalidated input flowing to dangerous operations)
3. **Orchestrate multi-step analysis** using IBM Bob's sequential capabilities
4. **Generate actionable remediation prompts** for automated fixes

---

## 🎯 Current State Analysis

### What Already Exists
✅ **Basic Security Scanner** (`/security_rules/index.js`)
- Pattern-based OWASP detection (800+ lines)
- Single-file vulnerability detection
- 29 vulnerability types covered

✅ **Remediation System** (`/engine/services/remediation.js`)
- Basic prompt generation for fixes
- Test case templates
- Priority scoring

✅ **API Structure** (`/engine/`)
- Express.js REST API
- Basic audit endpoints
- Mock IBM Bob client

### What's Missing (Your Tasks)
❌ **Cross-File Analysis** - No dependency mapping
❌ **Data Flow Tracking** - Can't trace input → output paths
❌ **Prompt Orchestration** - No multi-step Bob workflow
❌ **Context-Aware Scanning** - Bob not used for analysis yet
❌ **Repository-Wide Context** - Single file analysis only

---

## 🏗️ Architecture Design

### High-Level System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CodeGuard AI Engine                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Repository Ingestion Layer                       │  │
│  │     - Parse all files                                │  │
│  │     - Build file dependency graph                    │  │
│  │     - Extract imports/exports                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  2. Cross-File Analyzer (NEW - YOUR TASK)           │  │
│  │     - Map route → controller → service → DB          │  │
│  │     - Track data flow across files                   │  │
│  │     - Identify vulnerable data paths                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  3. IBM Bob Orchestrator (NEW - YOUR TASK)          │  │
│  │     - Multi-step prompt workflow                     │  │
│  │     - Context-aware vulnerability detection          │  │
│  │     - Semantic code understanding                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  4. Vulnerability Aggregator                         │  │
│  │     - Merge static + AI findings                     │  │
│  │     - Deduplicate results                            │  │
│  │     - Calculate risk scores                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  5. Remediation Engine (Enhanced)                    │  │
│  │     - Generate Bob-ready fix prompts                 │  │
│  │     - Include full context from analysis             │  │
│  │     - Prioritize by data flow risk                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Roadmap

### Phase 1: Cross-File Dependency Analyzer (Days 1-2)

#### Module: `/engine/services/dependencyAnalyzer.js`

**Purpose:** Build a graph of how files connect to each other

**Key Functions:**
```javascript
// Parse imports/exports from all files
function buildDependencyGraph(repoFiles) {
  // Returns: { 
  //   nodes: [{ file, exports, imports }],
  //   edges: [{ from, to, type }]
  // }
}

// Find all files that depend on a given file
function findDependents(file, graph) {
  // Returns: [dependentFile1, dependentFile2, ...]
}

// Find all files that a given file depends on
function findDependencies(file, graph) {
  // Returns: [dependencyFile1, dependencyFile2, ...]
}

// Trace a function call across files
function traceFunctionCall(functionName, startFile, graph) {
  // Returns: [{ file, line, context }]
}
```

**Implementation Strategy:**
1. Use regex to extract `import`, `require`, `export` statements
2. Build adjacency list representation of file relationships
3. Implement BFS/DFS for traversal
4. Cache results for performance

**Example Output:**
```json
{
  "graph": {
    "nodes": [
      {
        "file": "routes/user.js",
        "exports": ["getUserRoute", "createUserRoute"],
        "imports": ["userController"]
      },
      {
        "file": "controllers/userController.js",
        "exports": ["getUser", "createUser"],
        "imports": ["userService", "db"]
      }
    ],
    "edges": [
      { "from": "routes/user.js", "to": "controllers/userController.js", "type": "import" }
    ]
  }
}
```

---

### Phase 2: Data Flow Tracker (Days 2-3)

#### Module: `/engine/services/dataFlowTracker.js`

**Purpose:** Track how user input flows through the application to dangerous sinks

**Key Concepts:**
- **Sources:** User input points (req.body, req.query, req.params)
- **Sinks:** Dangerous operations (SQL queries, exec(), eval())
- **Sanitizers:** Validation/escaping functions

**Key Functions:**
```javascript
// Find all data sources (user input points)
function findDataSources(repoFiles) {
  // Returns: [{ file, line, source: 'req.body.id', type: 'user_input' }]
}

// Find all dangerous sinks
function findDataSinks(repoFiles) {
  // Returns: [{ file, line, sink: 'db.query()', type: 'sql_execution' }]
}

// Trace data flow from source to sink
function traceDataFlow(source, sink, dependencyGraph) {
  // Returns: {
  //   path: [{ file, line, operation }],
  //   isSanitized: boolean,
  //   riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  // }
}

// Detect cross-file vulnerabilities
function detectCrossFileVulnerabilities(repoFiles, dependencyGraph) {
  // Returns: [{ 
  //   source: {...}, 
  //   sink: {...}, 
  //   path: [...],
  //   vulnerability: 'SQL_INJECTION',
  //   severity: 'CRITICAL'
  // }]
}
```

**Example Detection:**
```javascript
// File: routes/user.js
app.get('/user/:id', (req, res) => {
  const userId = req.params.id; // SOURCE
  userController.getUser(userId, res);
});

// File: controllers/userController.js
function getUser(userId, res) {
  userService.fetchUser(userId, res);
}

// File: services/userService.js
function fetchUser(userId, res) {
  db.query(`SELECT * FROM users WHERE id = ${userId}`); // SINK
}

// Detection Result:
{
  "vulnerability": "CROSS_FILE_SQL_INJECTION",
  "severity": "CRITICAL",
  "dataFlow": {
    "source": { "file": "routes/user.js", "line": 2, "value": "req.params.id" },
    "path": [
      { "file": "routes/user.js", "function": "route handler" },
      { "file": "controllers/userController.js", "function": "getUser" },
      { "file": "services/userService.js", "function": "fetchUser" }
    ],
    "sink": { "file": "services/userService.js", "line": 3, "operation": "db.query" },
    "sanitized": false
  }
}
```

---

### Phase 3: IBM Bob Prompt Orchestrator (Days 3-5)

#### Module: `/engine/services/bobOrchestrator.js`

**Purpose:** Orchestrate multi-step analysis using IBM Bob's AI capabilities

**Multi-Step Workflow:**

```javascript
class BobOrchestrator {
  constructor(ibmBobClient) {
    this.client = ibmBobClient;
    this.context = {};
  }

  // Step 1: Repository Understanding
  async analyzeRepositoryStructure(repoFiles) {
    const prompt = this.buildStructureAnalysisPrompt(repoFiles);
    const response = await this.client.scan({
      task: 'analyze_repository_structure',
      files: repoFiles,
      prompt: prompt
    });
    
    this.context.structure = response;
    return response;
  }

  // Step 2: Cross-File Vulnerability Detection
  async detectCrossFileVulnerabilities(dependencyGraph, dataFlows) {
    const prompt = this.buildCrossFileDetectionPrompt(
      this.context.structure,
      dependencyGraph,
      dataFlows
    );
    
    const response = await this.client.scan({
      task: 'detect_cross_file_vulnerabilities',
      context: this.context.structure,
      dependencies: dependencyGraph,
      dataFlows: dataFlows,
      prompt: prompt
    });
    
    this.context.vulnerabilities = response;
    return response;
  }

  // Step 3: Generate Remediation Strategy
  async generateRemediationStrategy(vulnerabilities) {
    const prompt = this.buildRemediationPrompt(
      this.context.structure,
      this.context.vulnerabilities
    );
    
    const response = await this.client.scan({
      task: 'generate_remediation_strategy',
      context: this.context,
      vulnerabilities: vulnerabilities,
      prompt: prompt
    });
    
    return response;
  }

  // Step 4: Generate Change Impact Report
  async generateChangeImpactReport(remediationPlan) {
    const prompt = this.buildImpactReportPrompt(
      this.context,
      remediationPlan
    );
    
    const response = await this.client.scan({
      task: 'generate_impact_report',
      context: this.context,
      remediation: remediationPlan,
      prompt: prompt
    });
    
    return response;
  }

  // Master orchestration method
  async runCompleteAnalysis(repoFiles) {
    // Step 1: Understand structure
    const structure = await this.analyzeRepositoryStructure(repoFiles);
    
    // Step 2: Build dependency graph
    const depGraph = buildDependencyGraph(repoFiles);
    
    // Step 3: Track data flows
    const dataFlows = detectCrossFileVulnerabilities(repoFiles, depGraph);
    
    // Step 4: AI-powered cross-file detection
    const aiVulnerabilities = await this.detectCrossFileVulnerabilities(
      depGraph, 
      dataFlows
    );
    
    // Step 5: Generate remediation
    const remediation = await this.generateRemediationStrategy(
      aiVulnerabilities
    );
    
    // Step 6: Impact report
    const impactReport = await this.generateChangeImpactReport(remediation);
    
    return {
      structure,
      dependencyGraph: depGraph,
      dataFlows,
      vulnerabilities: aiVulnerabilities,
      remediation,
      impactReport
    };
  }
}
```

---

### Phase 4: Prompt Engineering (Days 5-6)

#### Module: `/engine/prompts/bobPrompts.js`

**Purpose:** Craft effective prompts for IBM Bob

**Key Prompt Templates:**

```javascript
const PROMPTS = {
  STRUCTURE_ANALYSIS: `
You are analyzing a codebase for security vulnerabilities.

TASK: Understand the repository structure and identify key architectural patterns.

FILES PROVIDED:
{{fileList}}

ANALYZE:
1. What is the application architecture? (MVC, microservices, etc.)
2. What are the main entry points? (routes, API endpoints)
3. What are the data storage mechanisms? (databases, caches)
4. What external services are integrated?
5. What authentication/authorization mechanisms exist?

OUTPUT FORMAT: JSON with structure analysis
`,

  CROSS_FILE_VULNERABILITY: `
You are a security expert analyzing cross-file data flows.

CONTEXT:
{{repositoryStructure}}

DEPENDENCY GRAPH:
{{dependencyGraph}}

DATA FLOWS DETECTED:
{{dataFlows}}

TASK: Identify vulnerabilities where user input flows across multiple files to dangerous operations WITHOUT proper sanitization.

FOCUS ON:
1. SQL Injection across route → controller → service → database
2. Command Injection in multi-file workflows
3. XSS where user input is rendered after passing through multiple functions
4. Authentication bypasses due to missing checks in the call chain

For each vulnerability found, provide:
- Source file and line (where user input enters)
- Sink file and line (where dangerous operation occurs)
- Complete call chain
- Why existing sanitization (if any) is insufficient
- Recommended fix with code examples

OUTPUT FORMAT: JSON array of cross-file vulnerabilities
`,

  REMEDIATION_STRATEGY: `
You are a senior developer creating a remediation plan.

VULNERABILITIES FOUND:
{{vulnerabilities}}

REPOSITORY CONTEXT:
{{repositoryContext}}

TASK: Create a comprehensive remediation strategy that:
1. Prioritizes fixes by risk and effort
2. Ensures fixes don't break existing functionality
3. Provides complete code changes for each file
4. Includes test cases to verify fixes
5. Documents any dependency updates needed

For each fix:
- Provide COMPLETE file content (not just snippets)
- Explain what changed and why
- List any new dependencies to install
- Provide test cases

OUTPUT FORMAT: JSON remediation plan
`,

  IMPACT_REPORT: `
You are a technical lead creating a report for stakeholders.

REMEDIATION PLAN:
{{remediationPlan}}

TASK: Generate a Change Impact Report for the Product Lead.

INCLUDE:
1. Executive Summary (non-technical)
2. Risk Reduction Metrics (before/after scores)
3. Estimated Time Savings ($$ value)
4. Files Modified (count and list)
5. Testing Requirements
6. Deployment Considerations
7. Rollback Plan

OUTPUT FORMAT: Markdown report suitable for presentation
`
};

function buildPrompt(template, variables) {
  let prompt = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    prompt = prompt.replace(
      new RegExp(placeholder, 'g'),
      typeof value === 'object' ? JSON.stringify(value, null, 2) : value
    );
  }
  return prompt;
}

module.exports = { PROMPTS, buildPrompt };
```

---

## 📁 New Directory Structure

```
engine/
├── services/
│   ├── auditService.js              (existing)
│   ├── dependencyAnalyzer.js        (NEW - Phase 1)
│   ├── dataFlowTracker.js           (NEW - Phase 2)
│   ├── bobOrchestrator.js           (NEW - Phase 3)
│   ├── crossFileDetector.js         (NEW - combines Phase 1 & 2)
│   └── remediation.js               (existing - enhance)
├── prompts/
│   └── bobPrompts.js                (NEW - Phase 4)
├── utils/
│   ├── graphBuilder.js              (NEW - graph utilities)
│   ├── codeParser.js                (NEW - AST parsing)
│   └── sanitizationDetector.js      (NEW - detect sanitizers)
└── config/
    └── ibmBobClient.js              (existing - enhance)
```

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// tests/dependencyAnalyzer.test.js
describe('Dependency Analyzer', () => {
  test('should build dependency graph from files', () => {
    const files = [/* mock files */];
    const graph = buildDependencyGraph(files);
    expect(graph.nodes).toHaveLength(3);
    expect(graph.edges).toHaveLength(2);
  });

  test('should find all dependents of a file', () => {
    const dependents = findDependents('userService.js', mockGraph);
    expect(dependents).toContain('userController.js');
  });
});

// tests/dataFlowTracker.test.js
describe('Data Flow Tracker', () => {
  test('should detect cross-file SQL injection', () => {
    const vulnerabilities = detectCrossFileVulnerabilities(mockFiles, mockGraph);
    expect(vulnerabilities).toHaveLength(1);
    expect(vulnerabilities[0].vulnerability).toBe('CROSS_FILE_SQL_INJECTION');
  });

  test('should recognize sanitized data flows', () => {
    const flow = traceDataFlow(source, sink, graphWithSanitizer);
    expect(flow.isSanitized).toBe(true);
    expect(flow.riskLevel).toBe('LOW');
  });
});
```

### Integration Tests
```javascript
// tests/bobOrchestrator.integration.test.js
describe('Bob Orchestrator Integration', () => {
  test('should complete full analysis workflow', async () => {
    const orchestrator = new BobOrchestrator(mockBobClient);
    const result = await orchestrator.runCompleteAnalysis(mockRepo);
    
    expect(result.structure).toBeDefined();
    expect(result.vulnerabilities).toBeInstanceOf(Array);
    expect(result.remediation).toBeDefined();
    expect(result.impactReport).toBeDefined();
  });
});
```

---

## 📊 Success Metrics

### Technical Metrics
- ✅ Detect at least 5 cross-file vulnerabilities in demo repo
- ✅ Build dependency graph in < 2 seconds for 100 files
- ✅ Trace data flows with 95%+ accuracy
- ✅ Generate Bob prompts that produce actionable fixes

### Demo Metrics
- ✅ Show "before" scan: 29 single-file vulnerabilities
- ✅ Show "after" scan: 29 + 5 cross-file vulnerabilities
- ✅ Demonstrate data flow visualization
- ✅ Show Bob-generated remediation for cross-file issue

---

## 🚀 Quick Start Implementation

### Day 1: Setup & Dependency Analyzer
```bash
cd Team-AVON-Project
git checkout -b feature/harshal-bob-engine

# Create new files
touch engine/services/dependencyAnalyzer.js
touch engine/services/dataFlowTracker.js
touch engine/services/bobOrchestrator.js
touch engine/prompts/bobPrompts.js

# Install any new dependencies
npm install --save acorn  # For AST parsing (optional)
```

### Day 2-3: Core Implementation
- Implement `dependencyAnalyzer.js`
- Implement `dataFlowTracker.js`
- Write unit tests

### Day 4-5: Bob Integration
- Implement `bobOrchestrator.js`
- Create prompt templates
- Test with IBM Bob API

### Day 6: Integration & Testing
- Integrate with existing audit pipeline
- End-to-end testing
- Documentation

---

## 🎓 Learning Resources

### Recommended Reading
1. **Matt Pocock's Skills Repo**: https://github.com/mattpocock/skills
   - Study TypeScript patterns
   - Learn testing strategies
   - Understand code organization

2. **Data Flow Analysis**:
   - Taint analysis concepts
   - Static analysis techniques
   - Graph algorithms (BFS/DFS)

3. **Prompt Engineering**:
   - Chain-of-thought prompting
   - Few-shot learning
   - Context window optimization

---

## 🤝 Integration Points

### With Karl (Backend)
- Your Bob engine outputs → Karl's REST API
- Data format: JSON with vulnerabilities + remediation
- Endpoint: `POST /api/v1/audit/cross-file`

### With Aley (Frontend)
- Your data flow graphs → Aley's visualization
- Format: D3.js compatible graph structure
- Real-time updates via WebSocket (optional)

### With Bridget (Design)
- Your impact metrics → Bridget's dashboard design
- Key metrics: cross-file vulnerabilities count, data flow paths
- Visual: Sankey diagram for data flows

---

## 📝 Next Steps

1. **Review this plan** - Understand the full scope
2. **Study Matt Pocock's repo** - Learn best practices
3. **Create feature branch** - Start with clean slate
4. **Implement Phase 1** - Dependency analyzer first
5. **Daily standups** - Sync with team on progress

---

## 🎯 Your Success Criteria

By the end of your implementation, you should be able to:

✅ **Demonstrate** a cross-file SQL injection detection  
✅ **Show** data flow from route → controller → database  
✅ **Generate** Bob prompts that produce working fixes  
✅ **Integrate** seamlessly with Karl's backend API  
✅ **Provide** metrics that Bridget can visualize  

---

## 💡 Pro Tips

1. **Start Simple**: Get basic dependency graph working first
2. **Test Early**: Write tests as you build, not after
3. **Use Mocks**: Mock IBM Bob API during development
4. **Document**: Comment your code - team needs to understand it
5. **Ask Questions**: Sync with team daily, don't work in isolation

---

**Remember**: You're building the "Brain" of CodeGuard. This is the differentiator that will win the hackathon. Focus on making Bob smart about cross-file vulnerabilities - that's what judges want to see!

Good luck, Harshal! 🚀

---

**Last Updated**: May 1, 2026  
**Next Review**: After Phase 1 completion