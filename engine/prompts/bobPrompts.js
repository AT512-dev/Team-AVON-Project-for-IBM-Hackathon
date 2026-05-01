/**
 * IBM BOB PROMPT TEMPLATES
 * Carefully crafted prompts for multi-step AI analysis
 * Optimized for IBM Bob's capabilities and token efficiency
 * 
 * @module bobPrompts
 * @author Harshal - Team AVON
 */

'use strict';

/**
 * Prompt templates for different analysis stages
 * Each prompt is designed to maximize Bob's context awareness
 */
const PROMPTS = {
  /**
   * STEP 1: Repository Structure Analysis
   * Goal: Understand the codebase architecture and patterns
   */
  STRUCTURE_ANALYSIS: `You are an expert software architect analyzing a codebase for security vulnerabilities.

TASK: Analyze the repository structure and identify key architectural patterns.

FILES PROVIDED:
{{fileList}}

Total Files: {{fileCount}}

ANALYZE AND PROVIDE:
1. **Application Architecture**: What pattern is used? (MVC, microservices, layered, etc.)
2. **Entry Points**: List all API routes, endpoints, or main entry points
3. **Data Storage**: Identify databases, caches, or data persistence mechanisms
4. **External Services**: List any third-party integrations or external APIs
5. **Authentication/Authorization**: Describe the auth mechanisms in place
6. **Security Patterns**: Note any existing security measures (validation, sanitization, etc.)

OUTPUT FORMAT: JSON with the following structure:
{
  "architecture": "string describing the pattern",
  "entryPoints": ["list of entry point files"],
  "dataStorage": ["list of data storage mechanisms"],
  "externalServices": ["list of external services"],
  "authentication": "description of auth mechanism",
  "securityPatterns": ["list of existing security measures"],
  "riskAreas": ["areas that need attention"]
}

Be concise but thorough. Focus on security-relevant aspects.`,

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
