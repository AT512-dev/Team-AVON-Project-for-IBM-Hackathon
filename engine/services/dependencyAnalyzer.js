/**
 * DEPENDENCY ANALYZER
 * Builds a graph of file dependencies to enable cross-file vulnerability detection
 * 
 * @module dependencyAnalyzer
 * @author Harshal - Team AVON
 */

'use strict';

/**
 * Build a dependency graph from repository files
 * Analyzes imports/exports to understand how files connect
 * 
 * @param {Array} repoFiles - Array of {file, content} objects
 * @returns {Object} Dependency graph with nodes and edges
 */
function buildDependencyGraph(repoFiles) {
  const graph = {
    nodes: [],
    edges: [],
    fileMap: new Map() // Quick lookup by filename
  };

  // Phase 1: Extract imports and exports from each file
  repoFiles.forEach(fileObj => {
    const node = {
      file: fileObj.file,
      exports: extractExports(fileObj.content),
      imports: extractImports(fileObj.content),
      functions: extractFunctions(fileObj.content),
      variables: extractVariables(fileObj.content)
    };
    
    graph.nodes.push(node);
    graph.fileMap.set(fileObj.file, node);
  });

  // Phase 2: Build edges based on import relationships
  graph.nodes.forEach(node => {
    node.imports.forEach(importInfo => {
      const targetFile = resolveImportPath(importInfo.path, node.file, graph.fileMap);
      
      if (targetFile) {
        graph.edges.push({
          from: node.file,
          to: targetFile,
          type: 'import',
          importedItems: importInfo.items
        });
      } else {
        // Try to find by partial match for relative imports
        const possibleMatches = Array.from(graph.fileMap.keys()).filter(file => {
          const importName = importInfo.path.replace(/^\.\.?\//, '').replace(/\//g, '/');
          return file.includes(importName) || file.endsWith(importName + '.js');
        });
        
        if (possibleMatches.length > 0) {
          graph.edges.push({
            from: node.file,
            to: possibleMatches[0],
            type: 'import',
            importedItems: importInfo.items
          });
        }
      }
    });
  });

  return graph;
}

/**
 * Extract export statements from file content
 * Supports: module.exports, exports.x, export default, export { }
 * 
 * @param {String} content - File content
 * @returns {Array} List of exported items
 */
function extractExports(content) {
  const exports = [];
  const lines = content.split('\n');

  // Pattern 1: module.exports = { ... }
  const moduleExportsMatch = content.match(/module\.exports\s*=\s*\{([^}]+)\}/s);
  if (moduleExportsMatch) {
    const items = moduleExportsMatch[1].split(',').map(item => {
      const name = item.trim().split(':')[0].trim();
      return { name, type: 'module.exports' };
    });
    exports.push(...items);
  }

  // Pattern 2: module.exports.functionName
  const namedExportsRegex = /module\.exports\.(\w+)\s*=/g;
  let match;
  while ((match = namedExportsRegex.exec(content)) !== null) {
    exports.push({ name: match[1], type: 'module.exports.named' });
  }

  // Pattern 3: exports.functionName
  const exportsRegex = /exports\.(\w+)\s*=/g;
  while ((match = exportsRegex.exec(content)) !== null) {
    exports.push({ name: match[1], type: 'exports.named' });
  }

  // Pattern 4: ES6 export default
  const defaultExportMatch = content.match(/export\s+default\s+(\w+)/);
  if (defaultExportMatch) {
    exports.push({ name: defaultExportMatch[1], type: 'export.default' });
  }

  // Pattern 5: ES6 named exports
  const namedExportRegex = /export\s+(?:const|let|var|function|class)\s+(\w+)/g;
  while ((match = namedExportRegex.exec(content)) !== null) {
    exports.push({ name: match[1], type: 'export.named' });
  }

  // Pattern 6: ES6 export { ... }
  const exportBlockMatch = content.match(/export\s*\{([^}]+)\}/);
  if (exportBlockMatch) {
    const items = exportBlockMatch[1].split(',').map(item => {
      const name = item.trim().split(/\s+as\s+/)[0].trim();
      return { name, type: 'export.block' };
    });
    exports.push(...items);
  }

  return exports;
}

/**
 * Extract import statements from file content
 * Supports: require(), import from, import()
 * 
 * @param {String} content - File content
 * @returns {Array} List of import statements with paths and items
 */
function extractImports(content) {
  const imports = [];

  // Pattern 1: const x = require('path')
  const requireRegex = /(?:const|let|var)\s+(?:\{([^}]+)\}|(\w+))\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  while ((match = requireRegex.exec(content)) !== null) {
    const items = match[1] 
      ? match[1].split(',').map(item => item.trim())
      : [match[2]];
    
    imports.push({
      path: match[3],
      items: items,
      type: 'require'
    });
  }

  // Pattern 2: ES6 import
  const importRegex = /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = importRegex.exec(content)) !== null) {
    const items = match[1]
      ? match[1].split(',').map(item => item.trim().split(/\s+as\s+/)[0].trim())
      : [match[2]];
    
    imports.push({
      path: match[3],
      items: items,
      type: 'import'
    });
  }

  // Pattern 3: import * as name from 'path'
  const importAllRegex = /import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = importAllRegex.exec(content)) !== null) {
    imports.push({
      path: match[2],
      items: [match[1]],
      type: 'import.all'
    });
  }

  return imports;
}

/**
 * Extract function definitions from file content
 * 
 * @param {String} content - File content
 * @returns {Array} List of function names and their line numbers
 */
function extractFunctions(content) {
  const functions = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Pattern 1: async function name() { } (check before regular function)
    let match = line.match(/async\s+function\s+(\w+)\s*\(/);
    if (match) {
      functions.push({ name: match[1], line: index + 1, type: 'async.function' });
      return;
    }

    // Pattern 2: function name() { }
    match = line.match(/function\s+(\w+)\s*\(/);
    if (match) {
      functions.push({ name: match[1], line: index + 1, type: 'function' });
      return;
    }

    // Pattern 3: const name = function() { }
    match = line.match(/(?:const|let|var)\s+(\w+)\s*=\s*function/);
    if (match) {
      functions.push({ name: match[1], line: index + 1, type: 'function.expression' });
      return;
    }

    // Pattern 4: const name = () => { }
    match = line.match(/(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>/);
    if (match) {
      functions.push({ name: match[1], line: index + 1, type: 'arrow.function' });
      return;
    }

    // Pattern 5: name: function() { } (object method)
    match = line.match(/(\w+)\s*:\s*function\s*\(/);
    if (match) {
      functions.push({ name: match[1], line: index + 1, type: 'method' });
      return;
    }

    // Pattern 6: name() { } (ES6 method shorthand)
    match = line.match(/(\w+)\s*\([^)]*\)\s*\{/);
    if (match && !line.trim().startsWith('if') && !line.trim().startsWith('while') && !line.trim().startsWith('for')) {
      functions.push({ name: match[1], line: index + 1, type: 'method.shorthand' });
    }
  });

  return functions;
}

/**
 * Extract variable declarations from file content
 * 
 * @param {String} content - File content
 * @returns {Array} List of variable names and their line numbers
 */
function extractVariables(content) {
  const variables = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Pattern: const/let/var name = ...
    const match = line.match(/(?:const|let|var)\s+(\w+)\s*=/);
    if (match) {
      variables.push({ name: match[1], line: index + 1 });
    }
  });

  return variables;
}

/**
 * Resolve import path to actual file in the repository
 * Handles relative paths, node_modules, and file extensions
 * 
 * @param {String} importPath - Import path from code
 * @param {String} currentFile - File containing the import
 * @param {Map} fileMap - Map of all files in repository
 * @returns {String|null} Resolved file path or null if not found
 */
function resolveImportPath(importPath, currentFile, fileMap) {
  // Skip node_modules and built-in modules
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
    return null;
  }

  // Handle relative paths
  const currentDir = currentFile.split('/').slice(0, -1).join('/');
  let resolvedPath = importPath;

  if (importPath.startsWith('./')) {
    resolvedPath = currentDir + '/' + importPath.substring(2);
  } else if (importPath.startsWith('../')) {
    const upLevels = (importPath.match(/\.\.\//g) || []).length;
    const dirParts = currentDir.split('/');
    const newDir = dirParts.slice(0, -upLevels).join('/');
    const remainingPath = importPath.replace(/\.\.\//g, '');
    resolvedPath = newDir + '/' + remainingPath;
  }

  // Try different file extensions
  const extensions = ['', '.js', '.ts', '.jsx', '.tsx', '/index.js', '/index.ts'];
  
  for (const ext of extensions) {
    const testPath = resolvedPath + ext;
    if (fileMap.has(testPath)) {
      return testPath;
    }
  }

  return null;
}

/**
 * Find all files that depend on a given file
 * 
 * @param {String} targetFile - File to find dependents for
 * @param {Object} graph - Dependency graph
 * @returns {Array} List of files that import the target file
 */
function findDependents(targetFile, graph) {
  return graph.edges
    .filter(edge => edge.to === targetFile)
    .map(edge => edge.from);
}

/**
 * Find all files that a given file depends on
 * 
 * @param {String} sourceFile - File to find dependencies for
 * @param {Object} graph - Dependency graph
 * @returns {Array} List of files that the source file imports
 */
function findDependencies(sourceFile, graph) {
  return graph.edges
    .filter(edge => edge.from === sourceFile)
    .map(edge => edge.to);
}

/**
 * Trace a function call across multiple files
 * Follows the call chain to find where a function is ultimately defined
 * 
 * @param {String} functionName - Name of function to trace
 * @param {String} startFile - File where the search starts
 * @param {Object} graph - Dependency graph
 * @returns {Array} Call chain with file and line information
 */
function traceFunctionCall(functionName, startFile, graph) {
  const callChain = [];
  const visited = new Set();
  
  function trace(funcName, currentFile) {
    if (visited.has(currentFile)) {
      return; // Prevent infinite loops
    }
    visited.add(currentFile);

    const node = graph.fileMap.get(currentFile);
    if (!node) return;

    // Check if function is defined in current file
    const funcDef = node.functions.find(f => f.name === funcName);
    if (funcDef) {
      callChain.push({
        file: currentFile,
        line: funcDef.line,
        function: funcName,
        type: 'definition'
      });
      return;
    }

    // Check if function is imported
    const importInfo = node.imports.find(imp => imp.items.includes(funcName));
    if (importInfo) {
      callChain.push({
        file: currentFile,
        function: funcName,
        type: 'import',
        from: importInfo.path
      });

      // Continue tracing in the imported file
      const resolvedFile = resolveImportPath(importInfo.path, currentFile, graph.fileMap);
      if (resolvedFile) {
        trace(funcName, resolvedFile);
      }
    }
  }

  trace(functionName, startFile);
  return callChain;
}

/**
 * Get all function calls in a file
 * 
 * @param {String} content - File content
 * @returns {Array} List of function calls with line numbers
 */
function extractFunctionCalls(content) {
  const calls = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Pattern: functionName(...)
    const callRegex = /(\w+)\s*\(/g;
    let match;
    
    while ((match = callRegex.exec(line)) !== null) {
      const funcName = match[1];
      
      // Skip common keywords
      if (['if', 'while', 'for', 'switch', 'catch', 'function'].includes(funcName)) {
        continue;
      }

      calls.push({
        function: funcName,
        line: index + 1,
        context: line.trim()
      });
    }
  });

  return calls;
}

module.exports = {
  buildDependencyGraph,
  extractExports,
  extractImports,
  extractFunctions,
  extractVariables,
  resolveImportPath,
  findDependents,
  findDependencies,
  traceFunctionCall,
  extractFunctionCalls
};

// Made with Bob
