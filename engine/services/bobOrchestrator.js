/**
 * IBM BOB ORCHESTRATOR
 * Multi-step AI workflow orchestration for intelligent code analysis
 * Leverages IBM Bob's full repository context and sequential task capabilities
 * 
 * @module bobOrchestrator
 * @author Harshal - Team AVON
 */

'use strict';

const { buildPrompt, PROMPTS } = require('../prompts/bobPrompts');
const { buildDependencyGraph } = require('./dependencyAnalyzer');
const { detectCrossFileVulnerabilities } = require('./dataFlowTracker');

/**
 * Bob Orchestrator Class
 * Manages multi-step AI analysis workflow using IBM Bob
 */
class BobOrchestrator {
  /**
   * Initialize the orchestrator
   * @param {Object} ibmBobClient - IBM Bob API client
   */
  constructor(ibmBobClient) {
    this.client = ibmBobClient;
    this.context = {
      structure: null,
      dependencyGraph: null,
      dataFlows: null,
      vulnerabilities: null,
      remediation: null,
      impactReport: null
    };
    this.executionLog = [];
  }

  /**
   * Log execution step for debugging and audit trail
   * @param {String} step - Step name
   * @param {Object} data - Step data
   */
  log(step, data) {
    this.executionLog.push({
      step,
      timestamp: new Date().toISOString(),
      data: data
    });
  }

  /**
   * STEP 1: Analyze Repository Structure
   * Uses Bob to understand the overall architecture and patterns
   * 
   * @param {Array} repoFiles - Repository files
   * @returns {Object} Structure analysis from Bob
   */
  async analyzeRepositoryStructure(repoFiles) {
    this.log('analyzeRepositoryStructure', { fileCount: repoFiles.length });

    // Build file list summary for prompt
    const fileList = repoFiles.map(f => ({
      file: f.file,
      lines: f.content.split('\n').length,
      type: this.detectFileType(f.file)
    }));

    // Create prompt for Bob
    const prompt = buildPrompt(PROMPTS.STRUCTURE_ANALYSIS, {
      fileList: JSON.stringify(fileList, null, 2),
      fileCount: repoFiles.length
    });

    try {
      // Call IBM Bob API
      const response = await this.client.scan({
        task: 'analyze_repository_structure',
        files: repoFiles.map(f => ({ path: f.file, content: f.content })),
        prompt: prompt,
        options: {
          temperature: 0.3, // Lower temperature for more deterministic analysis
          max_tokens: 2000
        }
      });

      this.context.structure = response;
      this.log('analyzeRepositoryStructure_complete', { success: true });
      
      return response;
    } catch (error) {
      this.log('analyzeRepositoryStructure_error', { error: error.message });
      
      // Fallback to basic analysis if Bob API fails
      return this.fallbackStructureAnalysis(repoFiles);
    }
  }

  /**
   * STEP 2: Detect Cross-File Vulnerabilities with AI
   * Uses Bob's context awareness to find complex vulnerabilities
   * 
   * @param {Object} dependencyGraph - File dependency graph
   * @param {Array} dataFlows - Detected data flows
   * @returns {Object} AI-detected vulnerabilities
   */
  async detectCrossFileVulnerabilitiesWithAI(dependencyGraph, dataFlows) {
    this.log('detectCrossFileVulnerabilitiesWithAI', {
      graphNodes: dependencyGraph.nodes.length,
      dataFlowCount: dataFlows.length
    });

    // Create prompt with full context
    const prompt = buildPrompt(PROMPTS.CROSS_FILE_VULNERABILITY, {
      repositoryStructure: JSON.stringify(this.context.structure, null, 2),
      dependencyGraph: JSON.stringify({
        nodeCount: dependencyGraph.nodes.length,
        edgeCount: dependencyGraph.edges.length,
        files: dependencyGraph.nodes.map(n => n.file)
      }, null, 2),
      dataFlows: JSON.stringify(dataFlows.slice(0, 10), null, 2) // Limit to top 10 for token efficiency
    });

    try {
      const response = await this.client.scan({
        task: 'detect_cross_file_vulnerabilities',
        context: {
          structure: this.context.structure,
          dependencies: dependencyGraph,
          dataFlows: dataFlows
        },
        prompt: prompt,
        options: {
          temperature: 0.2, // Very low temperature for security analysis
          max_tokens: 3000
        }
      });

      this.context.vulnerabilities = response;
      this.log('detectCrossFileVulnerabilitiesWithAI_complete', { 
        vulnerabilitiesFound: response.vulnerabilities?.length || 0 
      });

      return response;
    } catch (error) {
      this.log('detectCrossFileVulnerabilitiesWithAI_error', { error: error.message });
      
      // Return static analysis results as fallback
      return {
        vulnerabilities: dataFlows,
        source: 'static_analysis_fallback',
        note: 'IBM Bob API unavailable, using static analysis only'
      };
    }
  }

  /**
   * STEP 3: Generate Remediation Strategy
   * Uses Bob to create comprehensive fix plans
   * 
   * @param {Array} vulnerabilities - Detected vulnerabilities
   * @param {Array} repoFiles - Repository files for context
   * @returns {Object} Remediation plan
   */
  async generateRemediationStrategy(vulnerabilities, repoFiles) {
    this.log('generateRemediationStrategy', { 
      vulnerabilityCount: vulnerabilities.length 
    });

    // Prioritize critical vulnerabilities for remediation
    const criticalVulns = vulnerabilities
      .filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH')
      .slice(0, 5); // Focus on top 5 for token efficiency

    const prompt = buildPrompt(PROMPTS.REMEDIATION_STRATEGY, {
      vulnerabilities: JSON.stringify(criticalVulns, null, 2),
      repositoryContext: JSON.stringify({
        structure: this.context.structure,
        fileCount: repoFiles.length
      }, null, 2)
    });

    try {
      const response = await this.client.scan({
        task: 'generate_remediation_strategy',
        context: {
          structure: this.context.structure,
          vulnerabilities: criticalVulns,
          files: repoFiles
        },
        prompt: prompt,
        options: {
          temperature: 0.4, // Slightly higher for creative solutions
          max_tokens: 4000
        }
      });

      this.context.remediation = response;
      this.log('generateRemediationStrategy_complete', { success: true });

      return response;
    } catch (error) {
      this.log('generateRemediationStrategy_error', { error: error.message });
      
      // Fallback to basic remediation suggestions
      return this.fallbackRemediationStrategy(vulnerabilities);
    }
  }

  /**
   * STEP 4: Generate Change Impact Report
   * Creates executive summary for stakeholders
   * 
   * @param {Object} remediationPlan - Remediation plan
   * @returns {Object} Impact report
   */
  async generateChangeImpactReport(remediationPlan) {
    this.log('generateChangeImpactReport', { 
      fixCount: remediationPlan.fixes?.length || 0 
    });

    const prompt = buildPrompt(PROMPTS.IMPACT_REPORT, {
      remediationPlan: JSON.stringify(remediationPlan, null, 2)
    });

    try {
      const response = await this.client.scan({
        task: 'generate_impact_report',
        context: {
          structure: this.context.structure,
          vulnerabilities: this.context.vulnerabilities,
          remediation: remediationPlan
        },
        prompt: prompt,
        options: {
          temperature: 0.5, // Higher for natural language generation
          max_tokens: 2000
        }
      });

      this.context.impactReport = response;
      this.log('generateChangeImpactReport_complete', { success: true });

      return response;
    } catch (error) {
      this.log('generateChangeImpactReport_error', { error: error.message });
      
      // Fallback to basic impact report
      return this.fallbackImpactReport(remediationPlan);
    }
  }

  /**
   * MASTER ORCHESTRATION METHOD
   * Runs the complete multi-step analysis workflow
   * 
   * @param {Array} repoFiles - Repository files
   * @returns {Object} Complete analysis results
   */
  async runCompleteAnalysis(repoFiles) {
    console.log('[BOB] Starting Bob Orchestrator - Complete Analysis Workflow');
    console.log(`[BOB] Analyzing ${repoFiles.length} files...`);

    const startTime = Date.now();

    try {
      // STEP 1: Understand repository structure
      console.log('\n[BOB] Step 1/6: Analyzing repository structure...');
      const structure = await this.analyzeRepositoryStructure(repoFiles);

      // STEP 2: Build dependency graph (static analysis)
      console.log('[BOB] Step 2/6: Building dependency graph...');
      const depGraph = buildDependencyGraph(repoFiles);
      this.context.dependencyGraph = depGraph;

      // STEP 3: Track data flows (static analysis)
      console.log('[BOB] Step 3/6: Tracking data flows...');
      const dataFlows = detectCrossFileVulnerabilities(repoFiles, depGraph);
      this.context.dataFlows = dataFlows;

      // STEP 4: AI-powered cross-file detection
      console.log('[BOB] Step 4/6: Running AI-powered vulnerability detection...');
      const aiVulnerabilities = await this.detectCrossFileVulnerabilitiesWithAI(
        depGraph,
        dataFlows
      );

      // STEP 5: Generate remediation strategy
      console.log('[BOB] Step 5/6: Generating remediation strategy...');
      const remediation = await this.generateRemediationStrategy(
        aiVulnerabilities.vulnerabilities || dataFlows,
        repoFiles
      );

      // STEP 6: Create impact report
      console.log('[BOB] Step 6/6: Creating change impact report...');
      const impactReport = await this.generateChangeImpactReport(remediation);

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      console.log(`\n[BOB] Analysis complete in ${duration}s`);
      console.log(`[BOB] Found ${dataFlows.length} cross-file vulnerabilities`);
      console.log(`[BOB] Generated ${remediation.fixes?.length || 0} remediation plans`);

      return {
        success: true,
        duration: duration,
        structure: structure,
        dependencyGraph: {
          nodes: depGraph.nodes.length,
          edges: depGraph.edges.length,
          graph: depGraph
        },
        dataFlows: {
          count: dataFlows.length,
          flows: dataFlows
        },
        vulnerabilities: aiVulnerabilities,
        remediation: remediation,
        impactReport: impactReport,
        executionLog: this.executionLog,
        metadata: {
          timestamp: new Date().toISOString(),
          fileCount: repoFiles.length,
          bobApiUsed: true
        }
      };
    } catch (error) {
      console.error('[BOB] ERROR: Analysis failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        executionLog: this.executionLog,
        partialResults: this.context
      };
    }
  }

  /**
   * Detect file type from filename
   * @param {String} filename - File name
   * @returns {String} File type
   */
  detectFileType(filename) {
    // If filename is missing, just call it 'unknown' instead of crashing
    if (!filename || typeof filename !== 'string') {
      return 'unknown';
    }

    // Check for specific file patterns
    if (filename.includes('route') || filename.includes('router')) return 'route';
    if (filename.includes('controller')) return 'controller';
    if (filename.includes('service')) return 'service';
    if (filename.includes('model')) return 'model';
    if (filename.includes('middleware')) return 'middleware';
    if (filename.includes('config')) return 'config';
    if (filename.includes('test') || filename.includes('spec')) return 'test';
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.json')) return 'json';
    
    // Always have a fallback
    return 'unknown';
  }

  /**
   * Fallback structure analysis when Bob API is unavailable
   * @param {Array} repoFiles - Repository files
   * @returns {Object} Basic structure analysis
   */
  fallbackStructureAnalysis(repoFiles) {
    const structure = {
      architecture: 'Unknown (Bob API unavailable)',
      entryPoints: [],
      dataStorage: [],
      externalServices: [],
      authentication: 'Unknown',
      fileTypes: {}
    };

    repoFiles.forEach(f => {
      const type = this.detectFileType(f.file);
      structure.fileTypes[type] = (structure.fileTypes[type] || 0) + 1;

      if (type === 'route') {
        structure.entryPoints.push(f.file);
      }
    });

    return structure;
  }

  /**
   * Fallback remediation strategy when Bob API is unavailable
   * @param {Array} vulnerabilities - Vulnerabilities
   * @returns {Object} Basic remediation plan
   */
  fallbackRemediationStrategy(vulnerabilities) {
    return {
      source: 'fallback',
      fixes: vulnerabilities.map(v => ({
        vulnerability: v,
        priority: v.severity === 'CRITICAL' ? 1 : v.severity === 'HIGH' ? 2 : 3,
        suggestion: v.fix_suggestion || 'Manual review required',
        estimatedEffort: '30 minutes'
      }))
    };
  }

  /**
   * Fallback impact report when Bob API is unavailable
   * @param {Object} remediationPlan - Remediation plan
   * @returns {Object} Basic impact report
   */
  fallbackImpactReport(remediationPlan) {
    const fixCount = remediationPlan.fixes?.length || 0;
    
    return {
      source: 'fallback',
      summary: `${fixCount} vulnerabilities require remediation`,
      riskReduction: 'High',
      estimatedTime: `${fixCount * 30} minutes`,
      filesModified: fixCount,
      testingRequired: true,
      deploymentConsiderations: 'Standard deployment process',
      rollbackPlan: 'Git revert available'
    };
  }

  /**
   * Get execution summary
   * @returns {Object} Summary of execution
   */
  getExecutionSummary() {
    return {
      totalSteps: this.executionLog.length,
      steps: this.executionLog.map(log => ({
        step: log.step,
        timestamp: log.timestamp
      })),
      context: {
        hasStructure: !!this.context.structure,
        hasDependencyGraph: !!this.context.dependencyGraph,
        hasDataFlows: !!this.context.dataFlows,
        hasVulnerabilities: !!this.context.vulnerabilities,
        hasRemediation: !!this.context.remediation,
        hasImpactReport: !!this.context.impactReport
      }
    };
  }
}

module.exports = { BobOrchestrator };

// Made with Bob
