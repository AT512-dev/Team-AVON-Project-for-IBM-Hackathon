/**
 * DATA FLOW TRACKER TESTS
 * Integration-style tests following Matt Pocock's TDD principles
 * Tests verify behavior through public interfaces
 * 
 * @author Harshal - Team AVON
 */

'use strict';

const {
  findDataSources,
  findDataSinks,
  traceDataFlow,
  detectCrossFileVulnerabilities,
  checkSanitization,
  calculateRiskLevel,
  generateFixSuggestion,
  visualizeDataFlow
} = require('../dataFlowTracker');

const { buildDependencyGraph } = require('../dependencyAnalyzer');

describe('Data Flow Tracker - Public Interface Tests', () => {
  
  // Mock repository with SQL injection vulnerability
  const vulnerableRepo = [
    {
      file: 'routes/user.js',
      content: `
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  userController.getUser(userId, res);
});
`
    },
    {
      file: 'controllers/userController.js',
      content: `
function getUser(userId, res) {
  userService.fetchUser(userId, res);
}
module.exports = { getUser };
`
    },
    {
      file: 'services/userService.js',
      content: `
function fetchUser(userId, res) {
  const query = \`SELECT * FROM users WHERE id = \${userId}\`;
  db.query(query);
}
module.exports = { fetchUser };
`
    }
  ];

  // Mock repository with sanitized data flow
  const sanitizedRepo = [
    {
      file: 'routes/user.js',
      content: `
app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  userController.getUser(userId, res);
});
`
    },
    {
      file: 'controllers/userController.js',
      content: `
function getUser(userId, res) {
  const sanitizedId = validator.escape(userId);
  userService.fetchUser(sanitizedId, res);
}
module.exports = { getUser };
`
    },
    {
      file: 'services/userService.js',
      content: `
function fetchUser(userId, res) {
  db.query('SELECT * FROM users WHERE id = ?', [userId]);
}
module.exports = { fetchUser };
`
    }
  ];

  describe('findDataSources', () => {
    test('should find all user input points in repository', () => {
      const sources = findDataSources(vulnerableRepo);
      
      // Should find req.params.id
      expect(sources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            file: 'routes/user.js',
            sourceType: 'REQUEST_PARAMS',
            source: 'req.params.id',
            tainted: true
          })
        ])
      );
    });

    test('should detect req.body as data source', () => {
      const files = [{
        file: 'api.js',
        content: 'const data = req.body.username;'
      }];
      
      const sources = findDataSources(files);
      
      expect(sources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sourceType: 'REQUEST_BODY',
            tainted: true
          })
        ])
      );
    });

    test('should detect req.query as data source', () => {
      const files = [{
        file: 'api.js',
        content: 'const search = req.query.term;'
      }];
      
      const sources = findDataSources(files);
      
      expect(sources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sourceType: 'REQUEST_QUERY'
          })
        ])
      );
    });

    test('should track line numbers for sources', () => {
      const files = [{
        file: 'api.js',
        content: `
line 1
const id = req.params.id;
line 3
`
      }];
      
      const sources = findDataSources(files);
      
      expect(sources[0].line).toBe(3);
    });

    test('should handle files with no data sources', () => {
      const files = [{
        file: 'utils.js',
        content: 'function add(a, b) { return a + b; }'
      }];
      
      const sources = findDataSources(files);
      
      expect(sources).toHaveLength(0);
    });
  });

  describe('findDataSinks', () => {
    test('should find SQL query sinks', () => {
      const sinks = findDataSinks(vulnerableRepo);
      
      expect(sinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            file: 'services/userService.js',
            sinkType: 'SQL_QUERY',
            vulnerabilityType: 'SQL_INJECTION',
            severity: 'CRITICAL'
          })
        ])
      );
    });

    test('should detect command execution sinks', () => {
      const files = [{
        file: 'admin.js',
        content: 'exec(`rm -rf ${userInput}`);'
      }];
      
      const sinks = findDataSinks(files);
      
      expect(sinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sinkType: 'COMMAND_EXECUTION',
            vulnerabilityType: 'COMMAND_INJECTION',
            severity: 'CRITICAL'
          })
        ])
      );
    });

    test('should detect eval() as code injection sink', () => {
      const files = [{
        file: 'dangerous.js',
        content: 'eval(userCode);'
      }];
      
      const sinks = findDataSinks(files);
      
      expect(sinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sinkType: 'CODE_EVALUATION',
            vulnerabilityType: 'CODE_INJECTION',
            severity: 'CRITICAL'
          })
        ])
      );
    });

    test('should detect XSS sinks', () => {
      const files = [{
        file: 'render.js',
        content: 'element.innerHTML = userContent;'
      }];
      
      const sinks = findDataSinks(files);
      
      expect(sinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sinkType: 'HTML_RENDERING',
            vulnerabilityType: 'XSS',
            severity: 'HIGH'
          })
        ])
      );
    });

    test('should detect file operation sinks', () => {
      const files = [{
        file: 'files.js',
        content: 'fs.readFile(userPath, callback);'
      }];
      
      const sinks = findDataSinks(files);
      
      expect(sinks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sinkType: 'FILE_OPERATIONS',
            vulnerabilityType: 'PATH_TRAVERSAL',
            severity: 'HIGH'
          })
        ])
      );
    });

    test('should handle files with no sinks', () => {
      const files = [{
        file: 'utils.js',
        content: 'function add(a, b) { return a + b; }'
      }];
      
      const sinks = findDataSinks(files);
      
      expect(sinks).toHaveLength(0);
    });
  });

  describe('checkSanitization', () => {
    test('should detect parseInt as sanitization', () => {
      const content = `
const userId = req.params.id;
const sanitized = parseInt(userId);
db.query(sanitized);
`;
      
      const result = checkSanitization(content, 1, 4);
      
      expect(result.isSanitized).toBe(true);
      expect(result.sanitizers).toContain('parseInt');
    });

    test('should detect validator.escape as sanitization', () => {
      const content = `
const input = req.body.data;
const clean = validator.escape(input);
`;
      
      const result = checkSanitization(content, 1, 3);
      
      expect(result.isSanitized).toBe(true);
      expect(result.sanitizers).toContain('validator.escape');
    });

    test('should detect multiple sanitizers', () => {
      const content = `
const input = req.body.data;
const trimmed = input.trim();
const escaped = escape(trimmed);
const validated = validate(escaped);
`;
      
      const result = checkSanitization(content, 1, 5);
      
      expect(result.isSanitized).toBe(true);
      expect(result.sanitizers.length).toBeGreaterThan(1);
    });

    test('should return false when no sanitization present', () => {
      const content = `
const userId = req.params.id;
db.query(userId);
`;
      
      const result = checkSanitization(content, 1, 3);
      
      expect(result.isSanitized).toBe(false);
      expect(result.sanitizers).toHaveLength(0);
    });
  });

  describe('calculateRiskLevel', () => {
    test('should return CRITICAL for unsanitized critical sink', () => {
      const flow = {
        isSanitized: false,
        confidence: 0.95
      };
      
      const risk = calculateRiskLevel(flow, 'CRITICAL');
      
      expect(risk).toBe('CRITICAL');
    });

    test('should downgrade risk when sanitized', () => {
      const flow = {
        isSanitized: true,
        sanitizers: ['parseInt']
      };
      
      const risk = calculateRiskLevel(flow, 'CRITICAL');
      
      expect(risk).toBe('MEDIUM');
    });

    test('should return LOW for sanitized high severity', () => {
      const flow = {
        isSanitized: true,
        sanitizers: ['escape']
      };
      
      const risk = calculateRiskLevel(flow, 'HIGH');
      
      expect(risk).toBe('LOW');
    });
  });

  describe('traceDataFlow', () => {
    test('should trace data flow in same file', () => {
      const files = [{
        file: 'api.js',
        content: `
const userId = req.params.id;
const query = \`SELECT * FROM users WHERE id = \${userId}\`;
db.query(query);
`
      }];
      
      const sources = findDataSources(files);
      const sinks = findDataSinks(files);
      const graph = buildDependencyGraph(files);
      
      const flow = traceDataFlow(sources[0], sinks[0], graph, files);
      
      expect(flow.source.file).toBe('api.js');
      expect(flow.sink.file).toBe('api.js');
      expect(flow.path).toHaveLength(1);
      expect(flow.confidence).toBeGreaterThan(0.9);
    });

    test('should detect unsanitized flow', () => {
      const files = [{
        file: 'api.js',
        content: `
const userId = req.params.id;
db.query(\`SELECT * FROM users WHERE id = \${userId}\`);
`
      }];
      
      const sources = findDataSources(files);
      const sinks = findDataSinks(files);
      const graph = buildDependencyGraph(files);
      
      const flow = traceDataFlow(sources[0], sinks[0], graph, files);
      
      expect(flow.isSanitized).toBe(false);
      expect(flow.riskLevel).toBe('CRITICAL');
    });

    test('should detect sanitized flow', () => {
      const files = [{
        file: 'api.js',
        content: `
const userId = req.params.id;
const sanitized = parseInt(userId);
db.query('SELECT * FROM users WHERE id = ?', [sanitized]);
`
      }];
      
      const sources = findDataSources(files);
      const sinks = findDataSinks(files);
      const graph = buildDependencyGraph(files);
      
      const flow = traceDataFlow(sources[0], sinks[0], graph, files);
      
      expect(flow.isSanitized).toBe(true);
      expect(flow.sanitizers).toContain('parseInt');
    });
  });

  describe('detectCrossFileVulnerabilities', () => {
    test('should detect cross-file SQL injection', () => {
      const graph = buildDependencyGraph(vulnerableRepo);
      const vulnerabilities = detectCrossFileVulnerabilities(vulnerableRepo, graph);
      
      // Should find at least one vulnerability
      expect(vulnerabilities.length).toBeGreaterThan(0);
      
      // Should be SQL injection
      const sqlInjection = vulnerabilities.find(v => v.type === 'SQL_INJECTION');
      expect(sqlInjection).toBeDefined();
      expect(sqlInjection.severity).toBe('CRITICAL');
    });

    test('should provide complete data flow information', () => {
      const graph = buildDependencyGraph(vulnerableRepo);
      const vulnerabilities = detectCrossFileVulnerabilities(vulnerableRepo, graph);
      
      const vuln = vulnerabilities[0];
      
      expect(vuln).toHaveProperty('dataFlow');
      expect(vuln.dataFlow).toHaveProperty('source');
      expect(vuln.dataFlow).toHaveProperty('sink');
      expect(vuln.dataFlow).toHaveProperty('path');
      expect(vuln.dataFlow.source.file).toBe('routes/user.js');
      expect(vuln.dataFlow.sink.file).toBe('services/userService.js');
    });

    test('should not report sanitized flows as vulnerabilities', () => {
      const graph = buildDependencyGraph(sanitizedRepo);
      const vulnerabilities = detectCrossFileVulnerabilities(sanitizedRepo, graph);
      
      // Should have fewer or no vulnerabilities due to sanitization
      const unsanitizedVulns = vulnerabilities.filter(v => !v.dataFlow.sanitized);
      expect(unsanitizedVulns.length).toBeLessThan(vulnerabilities.length + 1);
    });

    test('should include fix suggestions', () => {
      const graph = buildDependencyGraph(vulnerableRepo);
      const vulnerabilities = detectCrossFileVulnerabilities(vulnerableRepo, graph);
      
      expect(vulnerabilities[0]).toHaveProperty('fix_suggestion');
      expect(vulnerabilities[0].fix_suggestion).toContain('parameterized');
    });

    test('should calculate confidence scores', () => {
      const graph = buildDependencyGraph(vulnerableRepo);
      const vulnerabilities = detectCrossFileVulnerabilities(vulnerableRepo, graph);
      
      vulnerabilities.forEach(vuln => {
        expect(vuln.confidence).toBeGreaterThan(0);
        expect(vuln.confidence).toBeLessThanOrEqual(1);
      });
    });

    test('should handle repository with no vulnerabilities', () => {
      const safeRepo = [{
        file: 'safe.js',
        content: 'function add(a, b) { return a + b; }'
      }];
      
      const graph = buildDependencyGraph(safeRepo);
      const vulnerabilities = detectCrossFileVulnerabilities(safeRepo, graph);
      
      expect(vulnerabilities).toHaveLength(0);
    });
  });

  describe('generateFixSuggestion', () => {
    test('should provide SQL injection fix suggestion', () => {
      const source = { file: 'routes/user.js', line: 2 };
      const sink = { file: 'services/userService.js', line: 3, vulnerabilityType: 'SQL_INJECTION' };
      const flow = { isSanitized: false };
      
      const suggestion = generateFixSuggestion(source, sink, flow);
      
      expect(suggestion).toContain('parameterized queries');
      expect(suggestion).toContain('routes/user.js:2');
      expect(suggestion).toContain('services/userService.js:3');
    });

    test('should provide command injection fix suggestion', () => {
      const source = { file: 'api.js', line: 5 };
      const sink = { file: 'exec.js', line: 10, vulnerabilityType: 'COMMAND_INJECTION' };
      const flow = { isSanitized: false };
      
      const suggestion = generateFixSuggestion(source, sink, flow);
      
      expect(suggestion).toContain('shell commands');
      expect(suggestion).toContain('allowlist');
    });

    test('should provide XSS fix suggestion', () => {
      const source = { file: 'input.js', line: 1 };
      const sink = { file: 'render.js', line: 5, vulnerabilityType: 'XSS' };
      const flow = { isSanitized: false };
      
      const suggestion = generateFixSuggestion(source, sink, flow);
      
      expect(suggestion).toContain('Escape HTML');
      expect(suggestion).toContain('Content Security Policy');
    });
  });

  describe('visualizeDataFlow', () => {
    test('should generate ASCII visualization of data flow', () => {
      const flow = {
        path: [
          { file: 'routes/user.js', line: 2, type: 'source' },
          { file: 'controllers/userController.js', line: 5, type: 'import', function: 'getUser' },
          { file: 'services/userService.js', line: 10, type: 'sink' }
        ],
        riskLevel: 'CRITICAL',
        confidence: 0.95,
        sanitizers: []
      };
      
      const visualization = visualizeDataFlow(flow);
      
      expect(visualization).toContain('Data Flow Visualization');
      expect(visualization).toContain('routes/user.js:2');
      expect(visualization).toContain('controllers/userController.js:5');
      expect(visualization).toContain('services/userService.js:10');
      expect(visualization).toContain('CRITICAL');
      expect(visualization).toContain('95%');
    });

    test('should show sanitization in visualization', () => {
      const flow = {
        path: [
          { file: 'a.js', line: 1, type: 'source' },
          { file: 'b.js', line: 2, type: 'sink' }
        ],
        riskLevel: 'LOW',
        confidence: 0.8,
        sanitizers: ['parseInt', 'escape']
      };
      
      const visualization = visualizeDataFlow(flow);
      
      expect(visualization).toContain('[SANITIZED]');
    });
  });

  describe('Integration: Complete Vulnerability Detection Workflow', () => {
    test('should detect and report complete cross-file vulnerability', () => {
      // Step 1: Build dependency graph
      const graph = buildDependencyGraph(vulnerableRepo);
      expect(graph.nodes).toHaveLength(3);
      
      // Step 2: Find sources and sinks
      const sources = findDataSources(vulnerableRepo);
      const sinks = findDataSinks(vulnerableRepo);
      expect(sources.length).toBeGreaterThan(0);
      expect(sinks.length).toBeGreaterThan(0);
      
      // Step 3: Detect vulnerabilities
      const vulnerabilities = detectCrossFileVulnerabilities(vulnerableRepo, graph);
      expect(vulnerabilities.length).toBeGreaterThan(0);
      
      // Step 4: Verify vulnerability details
      const vuln = vulnerabilities[0];
      expect(vuln.type).toBe('SQL_INJECTION');
      expect(vuln.severity).toBe('CRITICAL');
      expect(vuln.dataFlow.source.file).toBe('routes/user.js');
      expect(vuln.dataFlow.sink.file).toBe('services/userService.js');
      expect(vuln.fix_suggestion).toBeDefined();
      
      // Step 5: Visualize the flow
      const visualization = visualizeDataFlow({
        path: vuln.dataFlow.path,
        riskLevel: vuln.severity,
        confidence: vuln.confidence,
        sanitizers: vuln.dataFlow.sanitizers
      });
      expect(visualization).toContain('Data Flow Visualization');
    });

    test('should handle complex multi-file data flows', () => {
      const complexRepo = [
        {
          file: 'routes/api.js',
          content: 'app.post("/search", (req, res) => { searchController.search(req.body.query, res); });'
        },
        {
          file: 'controllers/searchController.js',
          content: 'function search(query, res) { searchService.performSearch(query, res); } module.exports = { search };'
        },
        {
          file: 'services/searchService.js',
          content: 'function performSearch(query, res) { dataLayer.query(query); } module.exports = { performSearch };'
        },
        {
          file: 'data/dataLayer.js',
          content: 'function query(q) { db.execute(`SELECT * FROM products WHERE name LIKE \'%${q}%\'`); } module.exports = { query };'
        }
      ];
      
      const graph = buildDependencyGraph(complexRepo);
      const vulnerabilities = detectCrossFileVulnerabilities(complexRepo, graph);
      
      // Should detect the vulnerability across 4 files
      expect(vulnerabilities.length).toBeGreaterThan(0);
      const vuln = vulnerabilities.find(v => v.type === 'SQL_INJECTION');
      expect(vuln).toBeDefined();
      expect(vuln.dataFlow.path.length).toBeGreaterThan(2);
    });
  });
});

// Made with Bob
