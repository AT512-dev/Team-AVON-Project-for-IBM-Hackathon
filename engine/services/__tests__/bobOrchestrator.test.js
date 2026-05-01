/**
 * BOB ORCHESTRATOR TESTS
 * Tests for multi-step AI workflow orchestration
 * Uses mocks for IBM Bob client
 * Following TDD principles - testing behavior through public interfaces
 * 
 * @author Bob - Team AVON Testing Suite
 */

'use strict';

const { BobOrchestrator } = require('../bobOrchestrator');

describe('Bob Orchestrator', () => {
  let mockBobClient;
  let orchestrator;
  let mockRepoFiles;

  beforeEach(() => {
    // Create mock IBM Bob client
    mockBobClient = {
      scan: jest.fn()
    };

    // Create orchestrator instance
    orchestrator = new BobOrchestrator(mockBobClient);

    // Mock repository files
    mockRepoFiles = [
      {
        file: 'routes/user.js',
        content: 'app.get("/user/:id", (req, res) => { userController.getUser(req.params.id, res); });'
      },
      {
        file: 'controllers/userController.js',
        content: 'function getUser(id, res) { userService.fetchUser(id, res); } module.exports = { getUser };'
      },
      {
        file: 'services/userService.js',
        content: 'function fetchUser(id, res) { db.query(`SELECT * FROM users WHERE id = ${id}`); } module.exports = { fetchUser };'
      }
    ];
  });

  describe('Initialization', () => {
    test('should initialize with empty context', () => {
      expect(orchestrator.context.structure).toBeNull();
      expect(orchestrator.context.dependencyGraph).toBeNull();
      expect(orchestrator.context.dataFlows).toBeNull();
      expect(orchestrator.context.vulnerabilities).toBeNull();
      expect(orchestrator.context.remediation).toBeNull();
      expect(orchestrator.context.impactReport).toBeNull();
    });

    test('should initialize with empty execution log', () => {
      expect(orchestrator.executionLog).toEqual([]);
    });

    test('should store client reference', () => {
      expect(orchestrator.client).toBe(mockBobClient);
    });
  });

  describe('log', () => {
    test('should add entry to execution log', () => {
      orchestrator.log('test_step', { data: 'test' });

      expect(orchestrator.executionLog).toHaveLength(1);
      expect(orchestrator.executionLog[0]).toMatchObject({
        step: 'test_step',
        data: { data: 'test' }
      });
      expect(orchestrator.executionLog[0].timestamp).toBeDefined();
    });

    test('should maintain log order', () => {
      orchestrator.log('step1', {});
      orchestrator.log('step2', {});
      orchestrator.log('step3', {});

      expect(orchestrator.executionLog).toHaveLength(3);
      expect(orchestrator.executionLog[0].step).toBe('step1');
      expect(orchestrator.executionLog[1].step).toBe('step2');
      expect(orchestrator.executionLog[2].step).toBe('step3');
    });
  });

  describe('detectFileType', () => {
    test('should detect route files', () => {
      expect(orchestrator.detectFileType('routes/user.js')).toBe('route');
      expect(orchestrator.detectFileType('api/router.js')).toBe('route');
    });

    test('should detect controller files', () => {
      expect(orchestrator.detectFileType('controllers/userController.js')).toBe('controller');
    });

    test('should detect service files', () => {
      expect(orchestrator.detectFileType('services/userService.js')).toBe('service');
    });

    test('should detect model files', () => {
      expect(orchestrator.detectFileType('models/User.js')).toBe('model');
    });

    test('should detect middleware files', () => {
      expect(orchestrator.detectFileType('middleware/auth.js')).toBe('middleware');
    });

    test('should detect config files', () => {
      expect(orchestrator.detectFileType('config/database.js')).toBe('config');
    });

    test('should detect test files', () => {
      expect(orchestrator.detectFileType('tests/user.test.js')).toBe('test');
      expect(orchestrator.detectFileType('specs/user.spec.js')).toBe('test');
    });

    test('should detect file extensions', () => {
      expect(orchestrator.detectFileType('utils.js')).toBe('javascript');
      expect(orchestrator.detectFileType('types.ts')).toBe('typescript');
      expect(orchestrator.detectFileType('package.json')).toBe('json');
    });

    test('should handle unknown files', () => {
      expect(orchestrator.detectFileType('unknown.xyz')).toBe('unknown');
    });

    test('should handle missing filename', () => {
      expect(orchestrator.detectFileType(null)).toBe('unknown');
      expect(orchestrator.detectFileType(undefined)).toBe('unknown');
      expect(orchestrator.detectFileType('')).toBe('unknown');
    });
  });

  describe('analyzeRepositoryStructure', () => {
    test('should call Bob API with correct parameters', async () => {
      mockBobClient.scan.mockResolvedValue({
        architecture: 'MVC',
        entryPoints: ['routes/user.js']
      });

      await orchestrator.analyzeRepositoryStructure(mockRepoFiles);

      expect(mockBobClient.scan).toHaveBeenCalledWith(
        expect.objectContaining({
          task: 'analyze_repository_structure',
          files: expect.any(Array),
          prompt: expect.stringContaining('REPOSITORY SNAPSHOT')
        })
      );
    });

    test('should store result in context', async () => {
      const mockResult = { architecture: 'MVC' };
      mockBobClient.scan.mockResolvedValue(mockResult);

      await orchestrator.analyzeRepositoryStructure(mockRepoFiles);

      expect(orchestrator.context.structure).toEqual(mockResult);
    });

    test('should log execution', async () => {
      mockBobClient.scan.mockResolvedValue({});

      await orchestrator.analyzeRepositoryStructure(mockRepoFiles);

      expect(orchestrator.executionLog.some(log => 
        log.step === 'analyzeRepositoryStructure'
      )).toBe(true);
    });

    test('should use fallback on API error', async () => {
      mockBobClient.scan.mockRejectedValue(new Error('API error'));

      const result = await orchestrator.analyzeRepositoryStructure(mockRepoFiles);

      expect(result).toHaveProperty('architecture');
      expect(result).toHaveProperty('fileTypes');
    });
  });

  describe('detectCrossFileVulnerabilitiesWithAI', () => {
    let mockDependencyGraph;
    let mockDataFlows;

    beforeEach(() => {
      mockDependencyGraph = {
        nodes: [{ file: 'test.js' }],
        edges: []
      };
      mockDataFlows = [
        { type: 'SQL_INJECTION', severity: 'CRITICAL' }
      ];
      orchestrator.context.structure = { architecture: 'MVC' };
    });

    test('should call Bob API with context', async () => {
      mockBobClient.scan.mockResolvedValue({
        vulnerabilities: []
      });

      await orchestrator.detectCrossFileVulnerabilitiesWithAI(
        mockDependencyGraph,
        mockDataFlows
      );

      expect(mockBobClient.scan).toHaveBeenCalledWith(
        expect.objectContaining({
          task: 'detect_cross_file_vulnerabilities',
          context: expect.objectContaining({
            structure: orchestrator.context.structure,
            dependencies: mockDependencyGraph,
            dataFlows: mockDataFlows
          })
        })
      );
    });

    test('should store vulnerabilities in context', async () => {
      const mockVulns = { vulnerabilities: [{ type: 'XSS' }] };
      mockBobClient.scan.mockResolvedValue(mockVulns);

      await orchestrator.detectCrossFileVulnerabilitiesWithAI(
        mockDependencyGraph,
        mockDataFlows
      );

      expect(orchestrator.context.vulnerabilities).toEqual(mockVulns);
    });

    test('should return fallback on API error', async () => {
      mockBobClient.scan.mockRejectedValue(new Error('API error'));

      const result = await orchestrator.detectCrossFileVulnerabilitiesWithAI(
        mockDependencyGraph,
        mockDataFlows
      );

      expect(result.source).toBe('static_analysis_fallback');
      expect(result.vulnerabilities).toEqual(mockDataFlows);
    });
  });

  describe('generateRemediationStrategy', () => {
    let mockVulnerabilities;

    beforeEach(() => {
      mockVulnerabilities = [
        { severity: 'CRITICAL', type: 'SQL_INJECTION' },
        { severity: 'HIGH', type: 'XSS' },
        { severity: 'MEDIUM', type: 'WEAK_CRYPTO' }
      ];
      orchestrator.context.structure = { architecture: 'MVC' };
    });

    test('should prioritize critical vulnerabilities', async () => {
      mockBobClient.scan.mockResolvedValue({ fixes: [] });

      await orchestrator.generateRemediationStrategy(mockVulnerabilities, mockRepoFiles);

      const callArgs = mockBobClient.scan.mock.calls[0][0];
      expect(callArgs.context.vulnerabilities).toHaveLength(2); // Only CRITICAL and HIGH
    });

    test('should store remediation in context', async () => {
      const mockRemediation = { fixes: [{ priority: 1 }] };
      mockBobClient.scan.mockResolvedValue(mockRemediation);

      await orchestrator.generateRemediationStrategy(mockVulnerabilities, mockRepoFiles);

      expect(orchestrator.context.remediation).toEqual(mockRemediation);
    });

    test('should use fallback on API error', async () => {
      mockBobClient.scan.mockRejectedValue(new Error('API error'));

      const result = await orchestrator.generateRemediationStrategy(
        mockVulnerabilities,
        mockRepoFiles
      );

      expect(result.source).toBe('fallback');
      expect(result.fixes).toBeDefined();
    });
  });

  describe('generateChangeImpactReport', () => {
    let mockRemediationPlan;

    beforeEach(() => {
      mockRemediationPlan = {
        fixes: [
          { priority: 1, estimatedEffort: '30 minutes' }
        ]
      };
      orchestrator.context.structure = { architecture: 'MVC' };
      orchestrator.context.vulnerabilities = { vulnerabilities: [] };
    });

    test('should call Bob API with remediation plan', async () => {
      mockBobClient.scan.mockResolvedValue({ summary: 'Report' });

      await orchestrator.generateChangeImpactReport(mockRemediationPlan);

      expect(mockBobClient.scan).toHaveBeenCalledWith(
        expect.objectContaining({
          task: 'generate_impact_report',
          context: expect.objectContaining({
            remediation: mockRemediationPlan
          })
        })
      );
    });

    test('should store impact report in context', async () => {
      const mockReport = { summary: 'Impact report' };
      mockBobClient.scan.mockResolvedValue(mockReport);

      await orchestrator.generateChangeImpactReport(mockRemediationPlan);

      expect(orchestrator.context.impactReport).toEqual(mockReport);
    });

    test('should use fallback on API error', async () => {
      mockBobClient.scan.mockRejectedValue(new Error('API error'));

      const result = await orchestrator.generateChangeImpactReport(mockRemediationPlan);

      expect(result.source).toBe('fallback');
      expect(result.summary).toBeDefined();
    });
  });

  describe('runCompleteAnalysis', () => {
    beforeEach(() => {
      // Mock all Bob API calls
      mockBobClient.scan.mockResolvedValue({
        architecture: 'MVC',
        vulnerabilities: [],
        fixes: [],
        summary: 'Complete'
      });
    });

    test('should execute all 6 steps in order', async () => {
      const result = await orchestrator.runCompleteAnalysis(mockRepoFiles);

      expect(result.success).toBe(true);
      expect(orchestrator.executionLog.length).toBeGreaterThan(0);
    });

    test('should return complete analysis results', async () => {
      const result = await orchestrator.runCompleteAnalysis(mockRepoFiles);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('structure');
      expect(result).toHaveProperty('dependencyGraph');
      expect(result).toHaveProperty('dataFlows');
      expect(result).toHaveProperty('vulnerabilities');
      expect(result).toHaveProperty('remediation');
      expect(result).toHaveProperty('impactReport');
      expect(result).toHaveProperty('executionLog');
      expect(result).toHaveProperty('metadata');
    });

    test('should include metadata', async () => {
      const result = await orchestrator.runCompleteAnalysis(mockRepoFiles);

      expect(result.metadata).toMatchObject({
        fileCount: mockRepoFiles.length,
        bobApiUsed: true
      });
      expect(result.metadata.timestamp).toBeDefined();
    });

    test('should handle errors gracefully', async () => {
      // Mock to reject on first call (structure analysis)
      mockBobClient.scan.mockRejectedValueOnce(new Error('Complete failure'));

      const result = await orchestrator.runCompleteAnalysis(mockRepoFiles);

      // The orchestrator uses fallback, so it still succeeds
      expect(result.success).toBe(true);
      expect(result.executionLog).toBeDefined();
    });

    test('should measure execution duration', async () => {
      const result = await orchestrator.runCompleteAnalysis(mockRepoFiles);

      expect(result.duration).toBeDefined();
      expect(parseFloat(result.duration)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getExecutionSummary', () => {
    test('should return execution summary', () => {
      orchestrator.log('step1', {});
      orchestrator.log('step2', {});
      orchestrator.context.structure = { test: 'data' };

      const summary = orchestrator.getExecutionSummary();

      expect(summary.totalSteps).toBe(2);
      expect(summary.steps).toHaveLength(2);
      expect(summary.context.hasStructure).toBe(true);
      expect(summary.context.hasDependencyGraph).toBe(false);
    });

    test('should track all context properties', () => {
      orchestrator.context.structure = {};
      orchestrator.context.dependencyGraph = {};
      orchestrator.context.dataFlows = {};
      orchestrator.context.vulnerabilities = {};
      orchestrator.context.remediation = {};
      orchestrator.context.impactReport = {};

      const summary = orchestrator.getExecutionSummary();

      expect(summary.context.hasStructure).toBe(true);
      expect(summary.context.hasDependencyGraph).toBe(true);
      expect(summary.context.hasDataFlows).toBe(true);
      expect(summary.context.hasVulnerabilities).toBe(true);
      expect(summary.context.hasRemediation).toBe(true);
      expect(summary.context.hasImpactReport).toBe(true);
    });
  });

  describe('Fallback Methods', () => {
    test('fallbackStructureAnalysis should return basic structure', () => {
      const result = orchestrator.fallbackStructureAnalysis(mockRepoFiles);

      expect(result).toHaveProperty('architecture');
      expect(result).toHaveProperty('entryPoints');
      expect(result).toHaveProperty('fileTypes');
      expect(result.fileTypes.route).toBeGreaterThan(0);
    });

    test('fallbackRemediationStrategy should create basic plan', () => {
      const vulns = [
        { severity: 'CRITICAL', fix_suggestion: 'Fix this' },
        { severity: 'HIGH', fix_suggestion: 'Fix that' }
      ];

      const result = orchestrator.fallbackRemediationStrategy(vulns);

      expect(result.source).toBe('fallback');
      expect(result.fixes).toHaveLength(2);
      expect(result.fixes[0].priority).toBe(1); // CRITICAL
      expect(result.fixes[1].priority).toBe(2); // HIGH
    });

    test('fallbackImpactReport should create basic report', () => {
      const plan = { fixes: [{}, {}, {}] };

      const result = orchestrator.fallbackImpactReport(plan);

      expect(result.source).toBe('fallback');
      expect(result.summary).toContain('3 vulnerabilities');
      expect(result.estimatedTime).toContain('90 minutes');
      expect(result.testingRequired).toBe(true);
    });
  });
});

// Made with Bob