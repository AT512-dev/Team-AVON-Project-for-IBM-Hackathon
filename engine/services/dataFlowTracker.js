/**
 * DATA FLOW TRACKER
 * Tracks how user input flows through the application to detect cross-file vulnerabilities
 * Implements taint analysis to identify dangerous data flows
 * 
 * @module dataFlowTracker
 * @author Harshal - Team AVON
 */

'use strict';

const { traceFunctionCall, extractFunctionCalls } = require('./dependencyAnalyzer');

/**
 * Data source types (where user input enters the system)
 */
const DATA_SOURCES = {
  REQUEST_BODY: /req\.body/g,
  REQUEST_QUERY: /req\.query/g,
  REQUEST_PARAMS: /req\.params/g,
  REQUEST_HEADERS: /req\.headers/g,
  REQUEST_COOKIES: /req\.cookies/g,
  URL_PARAMS: /\$\{.*req\./g,
  USER_INPUT: /userInput|input|data/g
};

/**
 * Data sinks (dangerous operations that could be exploited)
 */
const DATA_SINKS = {
  SQL_QUERY: {
    patterns: [
      /\.query\s*\(/g,
      /\.execute\s*\(/g,
      /\.raw\s*\(/g,
      /SELECT.*FROM/gi,
      /INSERT.*INTO/gi,
      /UPDATE.*SET/gi,
      /DELETE.*FROM/gi
    ],
    type: 'SQL_INJECTION',
    severity: 'CRITICAL'
  },
  COMMAND_EXECUTION: {
    patterns: [
      /exec\s*\(/g,
      /execSync\s*\(/g,
      /spawn\s*\(/g,
      /execFile\s*\(/g,
      /system\s*\(/g
    ],
    type: 'COMMAND_INJECTION',
    severity: 'CRITICAL'
  },
  CODE_EVALUATION: {
    patterns: [
      /eval\s*\(/g,
      /Function\s*\(/g,
      /setTimeout\s*\(\s*['"`]/g,
      /setInterval\s*\(\s*['"`]/g
    ],
    type: 'CODE_INJECTION',
    severity: 'CRITICAL'
  },
  FILE_OPERATIONS: {
    patterns: [
      /fs\.readFile\s*\(/g,
      /fs\.writeFile\s*\(/g,
      /fs\.unlink\s*\(/g,
      /fs\.readFileSync\s*\(/g,
      /fs\.writeFileSync\s*\(/g
    ],
    type: 'PATH_TRAVERSAL',
    severity: 'HIGH'
  },
  HTML_RENDERING: {
    patterns: [
      /\.innerHTML\s*=/g,
      /\.outerHTML\s*=/g,
      /document\.write\s*\(/g,
      /\.html\s*\(/g,
      /dangerouslySetInnerHTML/g
    ],
    type: 'XSS',
    severity: 'HIGH'
  },
  URL_REDIRECT: {
    patterns: [
      /res\.redirect\s*\(/g,
      /window\.location\s*=/g,
      /location\.href\s*=/g
    ],
    type: 'OPEN_REDIRECT',
    severity: 'MEDIUM'
  },
  NOSQL_QUERY: {
    patterns: [
      /\.find\s*\(/g,
      /\.findOne\s*\(/g,
      /\.update\s*\(/g,
      /\.remove\s*\(/g,
      /\$where/g,
      /\$regex/g
    ],
    type: 'NOSQL_INJECTION',
    severity: 'CRITICAL'
  }
};

/**
 * Sanitization functions (operations that clean/validate data)
 */
const SANITIZERS = [
  'escape',
  'sanitize',
  'validate',
  'clean',
  'filter',
  'parseInt',
  'parseFloat',
  'Number',
  'String',
  'encodeURIComponent',
  'encodeURI',
  'validator.escape',
  'validator.isEmail',
  'validator.isInt',
  'DOMPurify.sanitize',
  'xss',
  'sqlstring.escape'
];

/**
 * Find all data sources (user input points) in repository
 * 
 * @param {Array} repoFiles - Array of {file, content} objects
 * @returns {Array} List of data sources with file and line information
 */
function findDataSources(repoFiles) {
  const sources = [];

  repoFiles.forEach(fileObj => {
    const lines = fileObj.content.split('\n');

    lines.forEach((line, index) => {
      // Check each source pattern
      for (const [sourceName, pattern] of Object.entries(DATA_SOURCES)) {
        const matches = line.matchAll(pattern);
        
        for (const match of matches) {
          sources.push({
            file: fileObj.file,
            line: index + 1,
            source: match[0],
            sourceType: sourceName,
            context: line.trim(),
            tainted: true // User input is always tainted
          });
        }
      }
    });
  });

  return sources;
}

/**
 * Find all data sinks (dangerous operations) in repository
 * 
 * @param {Array} repoFiles - Array of {file, content} objects
 * @returns {Array} List of data sinks with file and line information
 */
function findDataSinks(repoFiles) {
  const sinks = [];

  repoFiles.forEach(fileObj => {
    const lines = fileObj.content.split('\n');

    lines.forEach((line, index) => {
      // Check each sink category
      for (const [sinkName, sinkInfo] of Object.entries(DATA_SINKS)) {
        for (const pattern of sinkInfo.patterns) {
          const matches = line.matchAll(pattern);
          
          for (const match of matches) {
            sinks.push({
              file: fileObj.file,
              line: index + 1,
              sink: match[0],
              sinkType: sinkName,
              vulnerabilityType: sinkInfo.type,
              severity: sinkInfo.severity,
              context: line.trim()
            });
          }
        }
      }
    });
  });

  return sinks;
}

/**
 * Check if data flow passes through a sanitization function
 * 
 * @param {String} content - File content to check
 * @param {Number} startLine - Starting line number
 * @param {Number} endLine - Ending line number
 * @returns {Object} Sanitization information
 */
function checkSanitization(content, startLine, endLine) {
  const lines = content.split('\n').slice(startLine - 1, endLine);
  const codeSection = lines.join('\n');

  const sanitizersFound = [];

  SANITIZERS.forEach(sanitizer => {
    const regex = new RegExp(`\\b${sanitizer}\\s*\\(`, 'g');
    if (regex.test(codeSection)) {
      sanitizersFound.push(sanitizer);
    }
  });

  return {
    isSanitized: sanitizersFound.length > 0,
    sanitizers: sanitizersFound,
    confidence: sanitizersFound.length > 0 ? 0.8 : 0.0
  };
}

/**
 * Trace data flow from source to sink
 * 
 * @param {Object} source - Data source object
 * @param {Object} sink - Data sink object
 * @param {Object} dependencyGraph - File dependency graph
 * @param {Array} repoFiles - Repository files
 * @returns {Object} Data flow trace with path and risk assessment
 */
function traceDataFlow(source, sink, dependencyGraph, repoFiles) {
  const flow = {
    source: source,
    sink: sink,
    path: [],
    isSanitized: false,
    sanitizers: [],
    riskLevel: 'UNKNOWN',
    confidence: 0.0
  };

  // Case 1: Source and sink in same file
  if (source.file === sink.file) {
    flow.path = [{
      file: source.file,
      startLine: source.line,
      endLine: sink.line,
      type: 'same_file'
    }];

    // Check for sanitization between source and sink
    const fileContent = repoFiles.find(f => f.file === source.file)?.content || '';
    const sanitization = checkSanitization(fileContent, source.line, sink.line);
    
    flow.isSanitized = sanitization.isSanitized;
    flow.sanitizers = sanitization.sanitizers;
    flow.confidence = 0.95;
  } 
  // Case 2: Source and sink in different files - trace through dependencies
  else {
    flow.path = traceCrossFileFlow(source, sink, dependencyGraph, repoFiles);
    
    // Check sanitization across the entire path
    const sanitization = checkPathSanitization(flow.path, repoFiles);
    flow.isSanitized = sanitization.isSanitized;
    flow.sanitizers = sanitization.sanitizers;
    flow.confidence = flow.path.length > 0 ? 0.85 : 0.3;
  }

  // Calculate risk level
  flow.riskLevel = calculateRiskLevel(flow, sink.severity);

  return flow;
}

/**
 * Trace data flow across multiple files
 * 
 * @param {Object} source - Data source
 * @param {Object} sink - Data sink
 * @param {Object} graph - Dependency graph
 * @param {Array} repoFiles - Repository files
 * @returns {Array} Path from source to sink
 */
function traceCrossFileFlow(source, sink, graph, repoFiles) {
  const path = [];
  
  // Start from source file
  path.push({
    file: source.file,
    line: source.line,
    type: 'source',
    operation: 'user_input'
  });

  // Find function calls in source file that might pass the data
  const sourceFile = repoFiles.find(f => f.file === source.file);
  if (!sourceFile) return path;

  const functionCalls = extractFunctionCalls(sourceFile.content);
  
  // Find calls that happen after the source line
  const relevantCalls = functionCalls.filter(call => call.line > source.line);

  // Trace each function call to see if it leads to the sink
  for (const call of relevantCalls) {
    const callChain = traceFunctionCall(call.function, source.file, graph);
    
    // Check if this call chain reaches the sink file
    const reachesSink = callChain.some(step => step.file === sink.file);
    
    if (reachesSink) {
      callChain.forEach(step => {
        path.push({
          file: step.file,
          line: step.line,
          type: step.type,
          function: step.function,
          operation: 'function_call'
        });
      });
      break;
    }
  }

  // Add sink as final step
  path.push({
    file: sink.file,
    line: sink.line,
    type: 'sink',
    operation: sink.sinkType
  });

  return path;
}

/**
 * Check if data is sanitized anywhere along the path
 * 
 * @param {Array} path - Data flow path
 * @param {Array} repoFiles - Repository files
 * @returns {Object} Sanitization information
 */
function checkPathSanitization(path, repoFiles) {
  const allSanitizers = [];

  for (let i = 0; i < path.length - 1; i++) {
    const step = path[i];
    const nextStep = path[i + 1];

    const fileContent = repoFiles.find(f => f.file === step.file)?.content || '';
    const sanitization = checkSanitization(
      fileContent,
      step.line || 1,
      nextStep.line || fileContent.split('\n').length
    );

    if (sanitization.isSanitized) {
      allSanitizers.push(...sanitization.sanitizers);
    }
  }

  return {
    isSanitized: allSanitizers.length > 0,
    sanitizers: [...new Set(allSanitizers)]
  };
}

/**
 * Calculate risk level based on flow characteristics
 * 
 * @param {Object} flow - Data flow object
 * @param {String} sinkSeverity - Severity of the sink
 * @returns {String} Risk level (CRITICAL, HIGH, MEDIUM, LOW)
 */
function calculateRiskLevel(flow, sinkSeverity) {
  if (flow.isSanitized) {
    // Sanitized flows are lower risk
    return sinkSeverity === 'CRITICAL' ? 'MEDIUM' : 'LOW';
  }

  // Unsanitized flows inherit sink severity
  return sinkSeverity;
}

/**
 * Detect cross-file vulnerabilities by analyzing data flows
 * Main entry point for cross-file vulnerability detection
 * 
 * @param {Array} repoFiles - Repository files
 * @param {Object} dependencyGraph - File dependency graph
 * @returns {Array} List of cross-file vulnerabilities
 */
function detectCrossFileVulnerabilities(repoFiles, dependencyGraph) {
  const vulnerabilities = [];

  // Step 1: Find all data sources and sinks
  const sources = findDataSources(repoFiles);
  const sinks = findDataSinks(repoFiles);

  console.log(`Found ${sources.length} data sources and ${sinks.length} data sinks`);

  // Step 2: Trace flows from each source to each sink
  sources.forEach(source => {
    sinks.forEach(sink => {
      // Skip if source is after sink in same file (unlikely to be related)
      if (source.file === sink.file && source.line > sink.line) {
        return;
      }

      const flow = traceDataFlow(source, sink, dependencyGraph, repoFiles);

      // Only report if flow is unsanitized and has reasonable confidence
      if (!flow.isSanitized && flow.confidence > 0.5 && flow.path.length > 0) {
        vulnerabilities.push({
          type: sink.vulnerabilityType,
          severity: flow.riskLevel,
          confidence: flow.confidence,
          description: `Cross-file ${sink.vulnerabilityType}: User input from ${source.file}:${source.line} flows to ${sink.file}:${sink.line} without sanitization`,
          dataFlow: {
            source: {
              file: source.file,
              line: source.line,
              type: source.sourceType,
              value: source.source
            },
            sink: {
              file: sink.file,
              line: sink.line,
              type: sink.sinkType,
              operation: sink.sink
            },
            path: flow.path,
            sanitized: flow.isSanitized,
            sanitizers: flow.sanitizers
          },
          fix_suggestion: generateFixSuggestion(source, sink, flow),
          why_it_matters: `Unvalidated user input can be exploited to perform ${sink.vulnerabilityType} attacks, potentially compromising the entire system`
        });
      }
    });
  });

  return vulnerabilities;
}

/**
 * Generate fix suggestion for a cross-file vulnerability
 * 
 * @param {Object} source - Data source
 * @param {Object} sink - Data sink
 * @param {Object} flow - Data flow
 * @returns {String} Fix suggestion
 */
function generateFixSuggestion(source, sink, flow) {
  const suggestions = {
    SQL_INJECTION: 'Use parameterized queries or prepared statements. Add input validation at the entry point.',
    COMMAND_INJECTION: 'Avoid executing shell commands with user input. Use allowlists for permitted commands.',
    CODE_INJECTION: 'Never use eval() with user input. Use JSON.parse() for data parsing.',
    PATH_TRAVERSAL: 'Validate and sanitize file paths. Use path.normalize() and check against allowlist.',
    XSS: 'Escape HTML entities before rendering. Use Content Security Policy headers.',
    OPEN_REDIRECT: 'Validate redirect URLs against allowlist. Use relative URLs when possible.',
    NOSQL_INJECTION: 'Sanitize user input before database queries. Avoid using $where operator with user data.'
  };

  const baseSuggestion = suggestions[sink.vulnerabilityType] || 'Validate and sanitize all user input before use.';
  
  return `${baseSuggestion}\n\nRecommended fix locations:\n` +
    `1. Add validation at source (${source.file}:${source.line})\n` +
    `2. Add sanitization before sink (${sink.file}:${sink.line})`;
}

/**
 * Generate a visual representation of data flow
 * Useful for debugging and visualization
 * 
 * @param {Object} flow - Data flow object
 * @returns {String} ASCII art representation of flow
 */
function visualizeDataFlow(flow) {
  let visualization = '\nData Flow Visualization:\n';
  visualization += '========================\n\n';

  flow.path.forEach((step, index) => {
    const arrow = index < flow.path.length - 1 ? '  ↓' : '';
    const sanitized = flow.sanitizers.length > 0 && index === flow.path.length - 2 ? ' [SANITIZED]' : '';
    
    visualization += `${index + 1}. ${step.file}:${step.line || '?'} (${step.type})${sanitized}\n`;
    if (step.function) {
      visualization += `   Function: ${step.function}\n`;
    }
    if (arrow) {
      visualization += `${arrow}\n`;
    }
  });

  visualization += `\nRisk Level: ${flow.riskLevel}\n`;
  visualization += `Confidence: ${(flow.confidence * 100).toFixed(0)}%\n`;

  return visualization;
}

module.exports = {
  findDataSources,
  findDataSinks,
  traceDataFlow,
  detectCrossFileVulnerabilities,
  checkSanitization,
  calculateRiskLevel,
  generateFixSuggestion,
  visualizeDataFlow,
  DATA_SOURCES,
  DATA_SINKS,
  SANITIZERS
};

// Made with Bob
