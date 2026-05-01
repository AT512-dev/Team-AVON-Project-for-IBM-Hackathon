/**
 * IBM BOB PROMPT TEMPLATES - ENHANCED VERSION
 * Advanced prompts for comprehensive AI-powered security analysis
 * Optimized for IBM Bob's capabilities with improved context awareness
 *
 * @module bobPrompts
 * @author Harshal - Team AVON
 * @version 2.0.0
 * @enhanced 2026-05-01
 */

'use strict';

/**
 * Prompt configuration and metadata
 */
const PROMPT_CONFIG = {
  version: '2.0.0',
  maxTokens: {
    STRUCTURE_ANALYSIS: 4000,
    CROSS_FILE_VULNERABILITY: 8000,
    REMEDIATION_STRATEGY: 6000,
    IMPACT_REPORT: 5000,
    CODE_REVIEW: 3000,
    THREAT_MODELING: 4000
  },
  temperature: 0.3, // Lower for more consistent security analysis
  confidenceThreshold: 0.7
};

/**
 * Enhanced prompt templates with improved instructions and examples
 */
const PROMPTS = {
  /**
   * STEP 1: Repository Structure Analysis (Enhanced)
   * Goal: Deep understanding of codebase architecture, patterns, and attack surface
   */
  STRUCTURE_ANALYSIS: `You are an elite software architect and security researcher with 15+ years of experience in vulnerability assessment and secure system design.

MISSION: Perform a comprehensive architectural analysis to map the attack surface and identify security-critical components.

REPOSITORY SNAPSHOT:
{{fileList}}

Total Files: {{fileCount}}
Languages Detected: {{languages}}
Framework: {{framework}}

DEEP ANALYSIS REQUIREMENTS:

1. **Architectural Pattern Recognition**
   - Identify the primary architecture (MVC, microservices, serverless, monolithic, etc.)
   - Map component relationships and dependencies
   - Identify design patterns (Repository, Factory, Singleton, etc.)
   - Note any anti-patterns or architectural smells

2. **Attack Surface Mapping**
   - List ALL entry points: API routes, webhooks, file uploads, WebSocket endpoints
   - Identify user input sources: query params, body, headers, cookies, files
   - Map data flow from entry points to sensitive operations
   - Note any publicly exposed endpoints without authentication

3. **Data Storage & Persistence**
   - Databases: Type (SQL/NoSQL), ORM usage, raw query patterns
   - Caching layers: Redis, Memcached, in-memory caches
   - File storage: Local filesystem, S3, cloud storage
   - Session management: JWT, cookies, server-side sessions

4. **External Dependencies & Integrations**
   - Third-party APIs and their trust level
   - Payment gateways, email services, SMS providers
   - Cloud services (AWS, Azure, GCP)
   - Identify outdated or vulnerable dependencies

5. **Authentication & Authorization**
   - Auth mechanism: JWT, OAuth, session-based, API keys
   - Role-based access control (RBAC) implementation
   - Permission checks: Where and how they're enforced
   - Identify missing auth checks or weak implementations

6. **Existing Security Measures**
   - Input validation: Libraries used, coverage
   - Output encoding: XSS prevention mechanisms
   - CSRF protection: Tokens, SameSite cookies
   - Rate limiting and DDoS protection
   - Security headers: CSP, HSTS, X-Frame-Options
   - Logging and monitoring capabilities

7. **High-Risk Areas (Priority Targets)**
   - Admin panels and privileged operations
   - File upload/download functionality
   - Database query construction
   - Command execution or system calls
   - Cryptographic operations
   - Deserialization of untrusted data

OUTPUT FORMAT (Strict JSON):
{
  "architecture": {
    "pattern": "string",
    "components": ["list of major components"],
    "designPatterns": ["patterns identified"],
    "antiPatterns": ["issues found"]
  },
  "attackSurface": {
    "entryPoints": [
      {
        "file": "path/to/file.js",
        "type": "API_ROUTE|WEBSOCKET|FILE_UPLOAD",
        "endpoint": "/api/users",
        "method": "POST",
        "authRequired": true,
        "inputSources": ["req.body", "req.params"]
      }
    ],
    "publicEndpoints": ["list of unauthenticated endpoints"],
    "totalEndpoints": 0
  },
  "dataStorage": {
    "databases": [
      {
        "type": "PostgreSQL|MongoDB|MySQL",
        "orm": "Sequelize|Mongoose|TypeORM",
        "rawQueries": true,
        "files": ["files using this DB"]
      }
    ],
    "caching": ["Redis", "in-memory"],
    "fileStorage": ["local", "S3"]
  },
  "externalServices": [
    {
      "name": "Stripe",
      "purpose": "Payment processing",
      "trustLevel": "HIGH|MEDIUM|LOW",
      "files": ["files integrating this service"]
    }
  ],
  "authentication": {
    "mechanism": "JWT|OAuth|Session",
    "implementation": "description",
    "strengths": ["what's done well"],
    "weaknesses": ["what's missing or weak"],
    "middlewareFiles": ["auth middleware files"]
  },
  "securityMeasures": {
    "inputValidation": {
      "library": "joi|express-validator|zod",
      "coverage": "HIGH|MEDIUM|LOW",
      "gaps": ["areas without validation"]
    },
    "outputEncoding": {
      "xssPrevention": true,
      "library": "DOMPurify|escape-html"
    },
    "csrfProtection": true,
    "rateLimiting": true,
    "securityHeaders": ["CSP", "HSTS"],
    "logging": {
      "enabled": true,
      "sensitiveDataLogged": false
    }
  },
  "riskAreas": [
    {
      "area": "Admin Panel",
      "risk": "CRITICAL|HIGH|MEDIUM|LOW",
      "reason": "Why this is risky",
      "files": ["affected files"]
    }
  ],
  "recommendations": [
    "Immediate action items based on findings"
  ]
}

ANALYSIS GUIDELINES:
- Be thorough but precise - every finding must be actionable
- Prioritize security-critical components
- Consider both obvious and subtle vulnerabilities
- Think like an attacker: What would you target first?
- Provide specific file paths and line numbers when possible`,

  /**
   * STEP 2: Cross-File Vulnerability Detection
   * Goal: Find vulnerabilities that span multiple files
   */
  CROSS_FILE_VULNERABILITY: `You are a security expert specializing in cross-file vulnerability detection.

REPOSITORY CONTEXT:
{{repositoryStructure}}

DEPENDENCY GRAPH:
{{dependencyGraph}}

DETECTED DATA FLOWS:
{{dataFlows}}

TASK: Identify security vulnerabilities where user input flows across multiple files to dangerous operations WITHOUT proper sanitization.

FOCUS ON THESE VULNERABILITY TYPES:
1. **SQL Injection**: User input → route → controller → service → database query
2. **Command Injection**: User input → multi-file workflow → shell command execution
3. **XSS (Cross-Site Scripting)**: User input → processing → rendering without escaping
4. **Authentication Bypass**: Missing auth checks in the call chain
5. **Path Traversal**: File operations with unsanitized user input
6. **NoSQL Injection**: User input → MongoDB/NoSQL queries with $where or $regex

FOR EACH VULNERABILITY FOUND, PROVIDE:
- **Source**: File and line where user input enters (e.g., req.body, req.params)
- **Sink**: File and line where dangerous operation occurs (e.g., db.query, exec)
- **Call Chain**: Complete path from source to sink through all intermediate files
- **Why Vulnerable**: Explain why existing sanitization (if any) is insufficient
- **Severity**: CRITICAL, HIGH, MEDIUM, or LOW
- **Confidence**: 0.0 to 1.0 (how certain you are this is exploitable)
- **Exploit Scenario**: Brief description of how an attacker could exploit this
- **Recommended Fix**: Specific code changes needed, with examples

OUTPUT FORMAT: JSON array of vulnerabilities:
[
  {
    "type": "SQL_INJECTION",
    "severity": "CRITICAL",
    "confidence": 0.95,
    "source": {
      "file": "routes/user.js",
      "line": 15,
      "code": "const userId = req.params.id"
    },
    "sink": {
      "file": "services/userService.js",
      "line": 42,
      "code": "db.query(\`SELECT * FROM users WHERE id = \${userId}\`)"
    },
    "callChain": [
      "routes/user.js:15 → userController.getUser()",
      "controllers/userController.js:23 → userService.fetchUser()",
      "services/userService.js:42 → db.query()"
    ],
    "whyVulnerable": "User input flows directly to SQL query without parameterization",
    "exploitScenario": "Attacker can inject SQL: /user/1' OR '1'='1",
    "recommendedFix": {
      "description": "Use parameterized queries",
      "code": "db.query('SELECT * FROM users WHERE id = ?', [userId])"
    }
  }
]

IMPORTANT: Only report vulnerabilities with confidence > 0.7. Be precise and actionable.`,

  /**
   * STEP 3: Remediation Strategy Generation
   * Goal: Create comprehensive fix plans
   */
  REMEDIATION_STRATEGY: `You are a senior software engineer creating a remediation plan for security vulnerabilities.

VULNERABILITIES FOUND:
{{vulnerabilities}}

REPOSITORY CONTEXT:
{{repositoryContext}}

TASK: Create a comprehensive, actionable remediation strategy that:
1. Prioritizes fixes by risk (severity × confidence) and implementation effort
2. Ensures fixes don't break existing functionality
3. Provides COMPLETE code changes for each affected file
4. Includes test cases to verify fixes work correctly
5. Documents any new dependencies or configuration changes needed

FOR EACH FIX, PROVIDE:

**Priority Calculation**: 
- CRITICAL severity + high confidence = Priority 1 (fix immediately)
- HIGH severity = Priority 2 (fix soon)
- MEDIUM/LOW severity = Priority 3 (fix when possible)

**Implementation Details**:
- **File**: Full path to file that needs changes
- **Changes**: Complete code diff showing before/after
- **Explanation**: What changed and why it's secure now
- **Dependencies**: Any new packages needed (e.g., validator, sqlstring)
- **Configuration**: Any .env or config changes required

**Testing Strategy**:
- **Unit Tests**: Test cases for the fixed code
- **Integration Tests**: End-to-end tests for the data flow
- **Security Tests**: Tests that verify the vulnerability is fixed

**Rollback Plan**:
- How to revert if the fix causes issues
- What to monitor after deployment

OUTPUT FORMAT: JSON with this structure:
{
  "summary": {
    "totalVulnerabilities": 5,
    "criticalCount": 2,
    "highCount": 3,
    "estimatedTotalEffort": "4 hours"
  },
  "fixes": [
    {
      "priority": 1,
      "vulnerability": { /* original vulnerability object */ },
      "implementation": {
        "file": "services/userService.js",
        "changes": {
          "before": "db.query(\`SELECT * FROM users WHERE id = \${userId}\`)",
          "after": "db.query('SELECT * FROM users WHERE id = ?', [userId])"
        },
        "explanation": "Replaced string interpolation with parameterized query to prevent SQL injection",
        "lineNumbers": { "start": 42, "end": 42 }
      },
      "dependencies": [
        { "package": "mysql2", "version": "^3.0.0", "reason": "Supports parameterized queries" }
      ],
      "testing": {
        "unitTests": [
          {
            "name": "should safely handle malicious input",
            "code": "expect(await userService.fetchUser(\"1' OR '1'='1\")).toThrow()"
          }
        ],
        "integrationTests": [
          {
            "name": "should fetch user by valid ID",
            "code": "const user = await request(app).get('/user/123'); expect(user.status).toBe(200);"
          }
        ]
      },
      "estimatedEffort": "30 minutes",
      "rollbackPlan": "Revert commit, monitor error logs for query failures"
    }
  ],
  "deploymentChecklist": [
    "Run all tests",
    "Update dependencies (npm install)",
    "Review .env for new config",
    "Deploy to staging first",
    "Monitor logs for 24 hours"
  ]
}

Be thorough but practical. Focus on fixes that can be implemented quickly and safely.`,

  /**
   * STEP 4: Change Impact Report
   * Goal: Create executive summary for stakeholders
   */
  IMPACT_REPORT: `You are a technical lead creating a Change Impact Report for stakeholders.

REMEDIATION PLAN:
{{remediationPlan}}

TASK: Generate a comprehensive but accessible report that explains:
1. What vulnerabilities were found and why they matter
2. What changes are being made to fix them
3. The business impact (risk reduction, time saved, cost avoided)
4. Testing and deployment requirements
5. Risks and mitigation strategies

TARGET AUDIENCE: Mix of technical and non-technical stakeholders (Product Managers, CTOs, Security Officers)

OUTPUT FORMAT: Markdown report with these sections:

# Security Audit - Change Impact Report

## Executive Summary
[2-3 sentences: What was found, what's being fixed, overall impact]

## Vulnerabilities Discovered

### Critical Issues (Priority 1)
- **[Vulnerability Type]**: [Brief description]
  - **Risk**: [What could happen if exploited]
  - **Affected Files**: [List]
  - **Fix Status**: Planned/In Progress/Complete

### High Priority Issues (Priority 2)
[Same format as above]

## Risk Reduction Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Security Score | 42/100 | 85/100 | +43 points |
| Critical Vulnerabilities | 5 | 0 | -100% |
| High Risk Data Flows | 12 | 2 | -83% |

## Business Impact

### Time Savings
- **Manual Security Audit**: 40 hours @ $150/hr = $6,000
- **Automated Scan**: 5 minutes
- **Net Savings**: $5,950 per audit

### Risk Mitigation
- **Prevented Data Breach**: Estimated $2.5M in potential damages
- **Compliance**: Now meets OWASP Top 10 standards
- **Customer Trust**: Improved security posture

## Implementation Plan

### Phase 1: Critical Fixes (Week 1)
1. Fix SQL injection in user service
2. Fix command injection in admin panel
3. Deploy to staging

### Phase 2: High Priority (Week 2)
1. Fix XSS vulnerabilities
2. Add input validation middleware
3. Deploy to production

### Phase 3: Medium Priority (Week 3)
1. Update dependencies
2. Add security headers
3. Implement rate limiting

## Files Modified

Total: [X] files across [Y] modules

**Backend Services**: [List]
**API Routes**: [List]
**Database Layer**: [List]
**Configuration**: [List]

## Testing Requirements

### Automated Tests
- [X] new unit tests added
- [X] integration tests updated
- [X] security tests created

### Manual Testing
- [ ] Penetration testing on staging
- [ ] Load testing with security fixes
- [ ] User acceptance testing

## Deployment Considerations

### Prerequisites
- Update Node.js dependencies
- Review environment variables
- Backup database before deployment

### Deployment Steps
1. Deploy to staging environment
2. Run automated test suite
3. Manual security verification
4. Deploy to production (off-peak hours)
5. Monitor for 24 hours

### Monitoring
- Watch error logs for query failures
- Monitor API response times
- Track authentication failures
- Alert on suspicious patterns

## Rollback Plan

If issues arise:
1. Revert to previous Git commit
2. Restore database backup if needed
3. Notify team and stakeholders
4. Investigate root cause
5. Re-plan deployment

**Rollback Time**: < 15 minutes

## Risks and Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking changes | Low | High | Comprehensive testing, staged rollout |
| Performance impact | Low | Medium | Load testing, monitoring |
| User disruption | Very Low | Medium | Deploy off-peak, quick rollback |

## Recommendations

1. **Immediate**: Deploy critical fixes within 48 hours
2. **Short-term**: Implement automated security scanning in CI/CD
3. **Long-term**: Regular security audits (quarterly)
4. **Training**: Security awareness for development team

## Conclusion

[2-3 sentences summarizing the overall impact and next steps]

---

**Report Generated**: [Timestamp]
**Prepared By**: CodeGuard AI Security Team
**Review Status**: Pending Approval

Make the report professional, data-driven, and actionable. Use clear language that both technical and non-technical readers can understand.`
};

/**
 * Build a prompt by replacing template variables
 * 
 * @param {String} template - Prompt template with {{variables}}
 * @param {Object} variables - Key-value pairs to replace in template
 * @returns {String} Completed prompt
 */
function buildPrompt(template, variables) {
  let prompt = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    const replacement = typeof value === 'object' 
      ? JSON.stringify(value, null, 2) 
      : String(value);
    
    prompt = prompt.replace(new RegExp(placeholder, 'g'), replacement);
  }
  
  return prompt;
}

/**
 * Validate that all required variables are provided
 * 
 * @param {String} template - Prompt template
 * @param {Object} variables - Provided variables
 * @returns {Object} Validation result
 */
function validatePrompt(template, variables) {
  const requiredVars = [];
  const regex = /\{\{(\w+)\}\}/g;
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    requiredVars.push(match[1]);
  }
  
  const missingVars = requiredVars.filter(v => !(v in variables));
  
  return {
    valid: missingVars.length === 0,
    missingVariables: missingVars,
    requiredVariables: [...new Set(requiredVars)]
  };
}

/**
 * Estimate token count for a prompt (rough approximation)
 * 
 * @param {String} prompt - Completed prompt
 * @returns {Number} Estimated token count
 */
function estimateTokens(prompt) {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(prompt.length / 4);
}

/**
 * Optimize prompt by removing unnecessary whitespace
 * 
 * @param {String} prompt - Prompt to optimize
 * @returns {String} Optimized prompt
 */
function optimizePrompt(prompt) {
  return prompt
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
    .replace(/  +/g, ' ') // Remove excessive spaces
    .trim();
}

module.exports = {
  PROMPTS,
  buildPrompt,
  validatePrompt,
  estimateTokens,
  optimizePrompt
};

// Made with Bob
