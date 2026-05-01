function scanFiles(files) {
  const findings = [];

  for (const fileObj of files) {
    const { file, content } = fileObj;
    const lines = content.split('\n');

    findings.push(...detectInjection(file, lines));
    findings.push(...detectBrokenAccessControl(file, lines));
    findings.push(...detectCryptographicFailures(file, lines));
    findings.push(...detectSecurityMisconfiguration(file, lines));
    findings.push(...detectAuthenticationFailures(file, lines));
    findings.push(...detectSSRF(file, lines));
    findings.push(...detectInsecureDesign(file, lines));
    findings.push(...detectVulnerableComponents(file, lines));
    findings.push(...detectLoggingFailures(file, lines));
    findings.push(...detectIntegrityFailures(file, lines));
  }

  return findings;
}

function detectInjection(file, lines) {
  const findings = [];

  const sqlPatterns = [
    { regex: /query\s*\(\s*['"`].*\$\{/i, confidence: 0.95, desc: 'SQL injection via template literal' },
    { regex: /query\s*\(\s*['"`].*\+\s*\w+/i, confidence: 0.95, desc: 'SQL injection via string concatenation' },
    { regex: /execute\s*\(\s*['"`].*\$\{/i, confidence: 0.95, desc: 'SQL injection in execute statement' },
    { regex: /execute\s*\(\s*['"`].*\+\s*\w+/i, confidence: 0.95, desc: 'SQL injection in execute statement' },
    { regex: /\.raw\s*\(\s*['"`].*\$\{/i, confidence: 0.95, desc: 'SQL injection in raw query' },
    { regex: /\.raw\s*\(\s*['"`].*\+\s*\w+/i, confidence: 0.95, desc: 'SQL injection in raw query' },
    { regex: /SELECT.*FROM.*WHERE.*\$\{/i, confidence: 0.90, desc: 'SQL injection in SELECT statement' },
    { regex: /INSERT.*INTO.*VALUES.*\$\{/i, confidence: 0.90, desc: 'SQL injection in INSERT statement' },
    { regex: /UPDATE.*SET.*\$\{/i, confidence: 0.90, desc: 'SQL injection in UPDATE statement' },
    { regex: /DELETE.*FROM.*WHERE.*\$\{/i, confidence: 0.90, desc: 'SQL injection in DELETE statement' },
  ];

  const noSqlPatterns = [
    { regex: /find\s*\(\s*\{[^}]*\$where/i, confidence: 0.90, desc: 'NoSQL injection via $where operator' },
    { regex: /find\s*\(\s*\{[^}]*\$regex.*req\./i, confidence: 0.85, desc: 'NoSQL injection via $regex with user input' },
    { regex: /findOne\s*\(\s*\{[^}]*\$where/i, confidence: 0.90, desc: 'NoSQL injection via $where in findOne' },
    { regex: /\.where\s*\(\s*req\./i, confidence: 0.80, desc: 'NoSQL injection via where clause with user input' },
  ];

  const commandPatterns = [
    { regex: /exec\s*\(\s*['"`].*\$\{/i, confidence: 0.95, desc: 'Command injection via exec with template literal' },
    { regex: /exec\s*\(\s*['"`].*\+\s*\w+/i, confidence: 0.95, desc: 'Command injection via exec with concatenation' },
    { regex: /spawn\s*\(\s*['"`].*\$\{/i, confidence: 0.95, desc: 'Command injection via spawn' },
    { regex: /spawn\s*\(\s*['"`].*\+\s*\w+/i, confidence: 0.95, desc: 'Command injection via spawn' },
    { regex: /execSync\s*\(\s*['"`].*\$\{/i, confidence: 0.95, desc: 'Command injection via execSync' },
    { regex: /execFile\s*\(\s*['"`].*\$\{/i, confidence: 0.95, desc: 'Command injection via execFile' },
    { regex: /system\s*\(\s*['"`].*\$\{/i, confidence: 0.95, desc: 'Command injection via system call' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of sqlPatterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'INJECTION',
          file,
          line: lineNumber,
          severity: 'CRITICAL',
          description: desc,
          confidence,
          fix_suggestion: 'Use parameterized queries or prepared statements',
          why_it_matters: 'SQL injection allows attackers to manipulate database queries, potentially leading to data theft, modification, or deletion'
        });
        break;
      }
    }

    for (const { regex, confidence, desc } of noSqlPatterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'INJECTION',
          file,
          line: lineNumber,
          severity: 'CRITICAL',
          description: desc,
          confidence,
          fix_suggestion: 'Sanitize user input and avoid using $where operator with untrusted data',
          why_it_matters: 'NoSQL injection can bypass authentication, extract sensitive data, or execute arbitrary JavaScript'
        });
        break;
      }
    }

    for (const { regex, confidence, desc } of commandPatterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'INJECTION',
          file,
          line: lineNumber,
          severity: 'CRITICAL',
          description: desc,
          confidence,
          fix_suggestion: 'Use array-based arguments instead of string concatenation, validate and sanitize all inputs',
          why_it_matters: 'Command injection allows attackers to execute arbitrary system commands, potentially compromising the entire server'
        });
        break;
      }
    }
  });

  return findings;
}

function detectBrokenAccessControl(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /req\.params\.\w+.*(?!.*(?:auth|permission|role|verify|check))/i, confidence: 0.75, desc: 'Direct object reference without authorization check' },
    { regex: /\.findById\s*\(\s*req\.params/i, confidence: 0.85, desc: 'Database query using user-supplied ID without authorization' },
    { regex: /\.findOne\s*\(\s*\{.*req\.params/i, confidence: 0.80, desc: 'Database query without access control validation' },
    { regex: /if\s*\(\s*req\.user\.id\s*===\s*req\.params/i, confidence: 0.70, desc: 'Weak authorization check using simple equality' },
    { regex: /res\.sendFile\s*\(.*req\.(query|params)/i, confidence: 0.90, desc: 'File access without path validation or authorization' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'BROKEN_ACCESS_CONTROL',
          file,
          line: lineNumber,
          severity: 'HIGH',
          description: desc,
          confidence,
          fix_suggestion: 'Implement proper authorization checks before accessing resources, verify user permissions',
          why_it_matters: 'Broken access control allows unauthorized users to access, modify, or delete data they should not have access to'
        });
        break;
      }
    }
  });

  return findings;
}

function detectCryptographicFailures(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /createHash\s*\(\s*['"`]md5['"`]/i, confidence: 0.95, desc: 'Weak hashing algorithm MD5 detected' },
    { regex: /createHash\s*\(\s*['"`]sha1['"`]/i, confidence: 0.95, desc: 'Weak hashing algorithm SHA1 detected' },
    { regex: /password\s*=\s*['"`][^'"`]+['"`]/i, confidence: 0.90, desc: 'Hardcoded password in source code' },
    { regex: /api[_-]?key\s*=\s*['"`][^'"`]+['"`]/i, confidence: 0.90, desc: 'Hardcoded API key in source code' },
    { regex: /secret\s*=\s*['"`][^'"`]+['"`]/i, confidence: 0.85, desc: 'Hardcoded secret in source code' },
    { regex: /token\s*=\s*['"`][a-zA-Z0-9]{20,}['"`]/i, confidence: 0.85, desc: 'Hardcoded token in source code' },
    { regex: /createCipheriv\s*\(\s*['"`]des['"`]/i, confidence: 0.95, desc: 'Weak encryption algorithm DES detected' },
    { regex: /Math\.random\s*\(\s*\).*(?:password|token|secret|key)/i, confidence: 0.80, desc: 'Cryptographically weak random number generator' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'CRYPTOGRAPHIC_FAILURE',
          file,
          line: lineNumber,
          severity: 'HIGH',
          description: desc,
          confidence,
          fix_suggestion: 'Use strong algorithms (SHA-256, bcrypt), store secrets in environment variables, use crypto.randomBytes() for secure random values',
          why_it_matters: 'Weak cryptography and exposed secrets can lead to data breaches, unauthorized access, and compromise of sensitive information'
        });
        break;
      }
    }
  });

  return findings;
}

function detectSecurityMisconfiguration(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /cors\s*\(\s*\{[^}]*origin\s*:\s*['"`]\*['"`]/i, confidence: 0.90, desc: 'CORS configured to allow all origins (*)' },
    { regex: /app\.use\s*\(\s*cors\s*\(\s*\)\s*\)/i, confidence: 0.85, desc: 'CORS enabled without restrictions' },
    { regex: /helmet\s*\(\s*\{[^}]*contentSecurityPolicy\s*:\s*false/i, confidence: 0.90, desc: 'Content Security Policy disabled' },
    { regex: /process\.env\.NODE_ENV\s*===\s*['"`]production['"`].*console\./i, confidence: 0.75, desc: 'Debug logging in production' },
    { regex: /app\.set\s*\(\s*['"`]trust proxy['"`]\s*,\s*true\s*\)/i, confidence: 0.70, desc: 'Trust proxy enabled without validation' },
    { regex: /strictSSL\s*:\s*false/i, confidence: 0.95, desc: 'SSL certificate validation disabled' },
    { regex: /rejectUnauthorized\s*:\s*false/i, confidence: 0.95, desc: 'TLS certificate validation disabled' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'SECURITY_MISCONFIGURATION',
          file,
          line: lineNumber,
          severity: 'MEDIUM',
          description: desc,
          confidence,
          fix_suggestion: 'Configure security headers properly, restrict CORS origins, enable certificate validation, remove debug code from production',
          why_it_matters: 'Security misconfigurations expose applications to attacks and can lead to data exposure or system compromise'
        });
        break;
      }
    }
  });

  return findings;
}

function detectAuthenticationFailures(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /jwt\.sign\s*\([^)]*\)\s*(?!.*expiresIn)/i, confidence: 0.85, desc: 'JWT token without expiration time' },
    { regex: /session\s*\(\s*\{[^}]*secure\s*:\s*false/i, confidence: 0.90, desc: 'Session cookie not marked as secure' },
    { regex: /session\s*\(\s*\{[^}]*httpOnly\s*:\s*false/i, confidence: 0.90, desc: 'Session cookie not marked as httpOnly' },
    { regex: /bcrypt\.hash\s*\([^,]*,\s*[1-9]\s*\)/i, confidence: 0.85, desc: 'Bcrypt salt rounds too low' },
    { regex: /password\s*===\s*req\.body\.password/i, confidence: 0.95, desc: 'Plain text password comparison' },
    { regex: /\.compare\s*\(\s*req\.body\.password\s*,\s*user\.password\s*\)/i, confidence: 0.80, desc: 'Incorrect password comparison order' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'AUTHENTICATION_FAILURE',
          file,
          line: lineNumber,
          severity: 'HIGH',
          description: desc,
          confidence,
          fix_suggestion: 'Use strong password hashing (bcrypt >= 10 rounds), set JWT expiration, mark cookies as secure and httpOnly',
          why_it_matters: 'Weak authentication allows attackers to bypass security controls, impersonate users, and gain unauthorized access'
        });
        break;
      }
    }
  });

  return findings;
}

function detectSSRF(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /fetch\s*\(\s*req\.(body|query|params)/i, confidence: 0.90, desc: 'SSRF via fetch with user-controlled URL' },
    { regex: /axios\.(get|post|put|delete)\s*\(\s*req\.(body|query|params)/i, confidence: 0.90, desc: 'SSRF via axios with user-controlled URL' },
    { regex: /request\s*\(\s*\{[^}]*url\s*:\s*req\.(body|query|params)/i, confidence: 0.90, desc: 'SSRF via request library with user-controlled URL' },
    { regex: /http\.get\s*\(\s*req\.(body|query|params)/i, confidence: 0.90, desc: 'SSRF via http.get with user-controlled URL' },
    { regex: /https\.get\s*\(\s*req\.(body|query|params)/i, confidence: 0.90, desc: 'SSRF via https.get with user-controlled URL' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'SSRF',
          file,
          line: lineNumber,
          severity: 'CRITICAL',
          description: desc,
          confidence,
          fix_suggestion: 'Validate and whitelist allowed URLs, use URL parsing to check protocol and domain, block internal IP ranges',
          why_it_matters: 'SSRF allows attackers to make requests to internal systems, potentially accessing sensitive data or services not exposed to the internet'
        });
        break;
      }
    }
  });

  return findings;
}

function detectInsecureDesign(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /setTimeout\s*\([^)]*req\.(body|query|params)/i, confidence: 0.80, desc: 'User-controlled delay enables timing attacks' },
    { regex: /app\.(get|post|put|delete)\s*\([^)]*\)\s*(?!.*(?:auth|authenticate|verify|check))/i, confidence: 0.60, desc: 'API endpoint without authentication middleware' },
    { regex: /res\.send\s*\(\s*error/i, confidence: 0.75, desc: 'Detailed error message exposed to client' },
    { regex: /catch\s*\(\s*\w+\s*\)\s*{\s*res\.(send|json)\s*\(\s*\w+/i, confidence: 0.80, desc: 'Exception details leaked in error response' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'INSECURE_DESIGN',
          file,
          line: lineNumber,
          severity: 'MEDIUM',
          description: desc,
          confidence,
          fix_suggestion: 'Implement authentication middleware, use generic error messages, add rate limiting, validate all inputs',
          why_it_matters: 'Insecure design flaws can lead to information disclosure, bypass of security controls, and exploitation of business logic'
        });
        break;
      }
    }
  });

  return findings;
}

function detectVulnerableComponents(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /require\s*\(\s*['"`]lodash['"`]\s*\)/i, confidence: 0.70, desc: 'Lodash usage - verify version >= 4.17.21' },
    { regex: /require\s*\(\s*['"`]moment['"`]\s*\)/i, confidence: 0.85, desc: 'Moment.js is deprecated with known vulnerabilities' },
    { regex: /require\s*\(\s*['"`]request['"`]\s*\)/i, confidence: 0.90, desc: 'Request package is deprecated' },
    { regex: /require\s*\(\s*['"`]xml2js['"`]\s*\)/i, confidence: 0.80, desc: 'xml2js has XXE vulnerabilities' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'VULNERABLE_COMPONENT',
          file,
          line: lineNumber,
          severity: 'MEDIUM',
          description: desc,
          confidence,
          fix_suggestion: 'Update to latest secure versions, replace deprecated packages with maintained alternatives',
          why_it_matters: 'Vulnerable components can be exploited by attackers to compromise the application through known security flaws'
        });
        break;
      }
    }
  });

  return findings;
}

function detectLoggingFailures(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /catch\s*\(\s*\w+\s*\)\s*\{\s*\}/i, confidence: 0.90, desc: 'Empty catch block - errors not logged' },
    { regex: /catch\s*\(\s*\w+\s*\)\s*\{\s*return/i, confidence: 0.85, desc: 'Error caught but not logged' },
    { regex: /\.then\s*\([^)]*\)\s*\.catch\s*\(\s*\)/i, confidence: 0.80, desc: 'Promise rejection not handled or logged' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'LOGGING_FAILURE',
          file,
          line: lineNumber,
          severity: 'LOW',
          description: desc,
          confidence,
          fix_suggestion: 'Implement proper error logging with context, use structured logging, monitor security events',
          why_it_matters: 'Insufficient logging prevents detection of security incidents and makes forensic analysis impossible'
        });
        break;
      }
    }
  });

  return findings;
}

function detectIntegrityFailures(file, lines) {
  const findings = [];

  const patterns = [
    { regex: /\beval\s*\(/i, confidence: 0.95, desc: 'eval() allows arbitrary code execution' },
    { regex: /Function\s*\(\s*['"`]/i, confidence: 0.90, desc: 'Function constructor enables dynamic code execution' },
    { regex: /setTimeout\s*\(\s*['"`]/i, confidence: 0.85, desc: 'setTimeout with string allows code injection' },
    { regex: /setInterval\s*\(\s*['"`]/i, confidence: 0.85, desc: 'setInterval with string allows code injection' },
    { regex: /vm\.runInNewContext/i, confidence: 0.90, desc: 'vm.runInNewContext executes arbitrary code' },
    { regex: /JSON\.parse\s*\(\s*req\.(body|query|params)/i, confidence: 0.80, desc: 'Unsafe JSON parsing of user input' },
    { regex: /require\s*\(\s*req\.(body|query|params)/i, confidence: 0.95, desc: 'Dynamic require with user input' },
  ];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    for (const { regex, confidence, desc } of patterns) {
      if (regex.test(trimmedLine)) {
        findings.push({
          type: 'INTEGRITY_FAILURE',
          file,
          line: lineNumber,
          severity: 'HIGH',
          description: desc,
          confidence,
          fix_suggestion: 'Avoid eval and dynamic code execution, validate and sanitize all inputs, use safe alternatives',
          why_it_matters: 'Code execution vulnerabilities allow attackers to run arbitrary code on the server, leading to complete system compromise'
        });
        break;
      }
    }
  });

  return findings;
}

module.exports = { scanFiles };