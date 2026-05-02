const fs = require('fs').promises;
const path = require('path');

/**
 * Recursively scans a directory and returns all files with their content
 * @param {string} dirPath - The directory path to scan
 * @param {Array<string>} extensions - File extensions to include (e.g., ['.js', '.ts', '.py'])
 * @returns {Promise<Array<{file: string, content: string, relativePath: string}>>}
 */
async function scanDirectory(dirPath, extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.php', '.rb', '.go', '.c', '.cpp', '.cs']) {
  const files = [];
  
  async function scan(currentPath) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        // Skip node_modules, .git, and other common directories
        if (entry.isDirectory()) {
          const dirName = entry.name;
          if (dirName === 'node_modules' || 
              dirName === '.git' || 
              dirName === 'dist' || 
              dirName === 'build' ||
              dirName === '.next' ||
              dirName === 'coverage' ||
              dirName === 'vendor' ||
              dirName === '__pycache__') {
            continue;
          }
          await scan(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              const relativePath = path.relative(dirPath, fullPath);
              
              // Format to match expected structure: {file, content}
              files.push({
                file: relativePath.replace(/\\/g, '/'), // Normalize path separators
                content: content
              });
            } catch (readError) {
              console.warn(`Could not read file ${fullPath}:`, readError.message);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${currentPath}:`, error.message);
    }
  }
  
  await scan(dirPath);
  return files;
}

/**
 * Analyzes file content for security vulnerabilities using regex patterns
 * @param {string} content - File content to analyze
 * @param {string} filePath - Path to the file being analyzed
 * @returns {Array<{type: string, line: number, code: string, severity: string}>}
 */
function analyzeFileContent(content, filePath) {
  const vulnerabilities = [];
  const lines = content.split('\n');
  
  // Security patterns to detect
  const patterns = [
    {
      regex: /eval\s*\(/gi,
      type: 'Code Injection',
      severity: 'CRITICAL',
      description: 'Use of eval() can lead to code injection vulnerabilities'
    },
    {
      regex: /exec\s*\(/gi,
      type: 'Command Injection',
      severity: 'CRITICAL',
      description: 'Use of exec() without proper sanitization can lead to command injection'
    },
    {
      regex: /(password|secret|api[_-]?key|token)\s*=\s*['"][^'"]+['"]/gi,
      type: 'Hardcoded Credentials',
      severity: 'CRITICAL',
      description: 'Hardcoded credentials detected in source code'
    },
    {
      regex: /innerHTML\s*=/gi,
      type: 'XSS Vulnerability',
      severity: 'HIGH',
      description: 'Direct innerHTML assignment can lead to XSS attacks'
    },
    {
      regex: /dangerouslySetInnerHTML/gi,
      type: 'XSS Vulnerability',
      severity: 'HIGH',
      description: 'dangerouslySetInnerHTML can lead to XSS if not properly sanitized'
    },
    {
      regex: /\$\{[^}]*\}/g,
      type: 'Template Injection',
      severity: 'MEDIUM',
      description: 'Template literals with user input can lead to injection attacks'
    },
    {
      regex: /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*\+/gi,
      type: 'SQL Injection',
      severity: 'CRITICAL',
      description: 'String concatenation in SQL queries can lead to SQL injection'
    }
  ];
  
  lines.forEach((line, index) => {
    patterns.forEach(pattern => {
      if (pattern.regex.test(line)) {
        vulnerabilities.push({
          type: pattern.type,
          line: index + 1,
          code: line.trim(),
          severity: pattern.severity,
          description: pattern.description,
          file: filePath
        });
      }
    });
  });
  
  return vulnerabilities;
}

module.exports = {
  scanDirectory,
  analyzeFileContent
};

// Made with Bob
