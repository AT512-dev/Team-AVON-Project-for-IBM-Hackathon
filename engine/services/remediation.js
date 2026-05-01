function generateRemediationPrompt(vulnerability, fileContent) {
  const lines = fileContent.split('\n');
  const targetLine = vulnerability.line - 1;
  
  const contextStart = Math.max(0, targetLine - 3);
  const contextEnd = Math.min(lines.length, targetLine + 4);
  const codeContext = lines.slice(contextStart, contextEnd)
    .map((line, idx) => {
      const lineNum = contextStart + idx + 1;
      const marker = lineNum === vulnerability.line ? '>>> ' : '    ';
      return `${marker}${lineNum}: ${line}`;
    })
    .join('\n');

  const prompt = {
    task: 'fix_security_vulnerability',
    vulnerability: {
      type: vulnerability.type,
      severity: vulnerability.severity,
      description: vulnerability.description,
      confidence: vulnerability.confidence,
      file: vulnerability.file,
      line: vulnerability.line
    },
    context: {
      code: codeContext,
      fix_suggestion: vulnerability.fix_suggestion,
      why_it_matters: vulnerability.why_it_matters
    },
    requirements: {
      preserve_functionality: true,
      add_comments: true,
      follow_best_practices: true
    },
    expected_output: {
      fixed_code: 'Complete fixed version of the vulnerable code section',
      explanation: 'Brief explanation of what was changed and why',
      test_cases: 'Array of test cases to verify the fix'
    }
  };

  return prompt;
}

function generateTestCaseTemplate(vulnerability) {
  const testTemplates = {
    INJECTION: {
      before: [
        {
          name: 'should detect SQL injection vulnerability',
          input: "'; DROP TABLE users; --",
          expected: 'vulnerability_detected',
          description: 'Malicious SQL input should be caught'
        },
        {
          name: 'should detect template literal injection',
          input: '${maliciousCode}',
          expected: 'vulnerability_detected',
          description: 'Template literal injection should be prevented'
        }
      ],
      after: [
        {
          name: 'should safely handle user input with parameterized query',
          input: "'; DROP TABLE users; --",
          expected: 'safe_execution',
          description: 'Malicious input should be safely escaped'
        },
        {
          name: 'should execute valid queries correctly',
          input: 'valid_user_id',
          expected: 'success',
          description: 'Normal operations should work after fix'
        }
      ]
    },
    CRYPTOGRAPHIC_FAILURE: {
      before: [
        {
          name: 'should detect hardcoded secret',
          check: 'secret_in_source_code',
          expected: 'vulnerability_detected',
          description: 'Hardcoded secrets should be flagged'
        },
        {
          name: 'should detect weak hashing algorithm',
          algorithm: 'MD5',
          expected: 'vulnerability_detected',
          description: 'Weak algorithms should be rejected'
        }
      ],
      after: [
        {
          name: 'should use environment variables for secrets',
          check: 'secret_from_env',
          expected: 'pass',
          description: 'Secrets should come from secure storage'
        },
        {
          name: 'should use strong hashing algorithm',
          algorithm: 'SHA-256',
          expected: 'pass',
          description: 'Strong algorithms should be used'
        }
      ]
    },
    BROKEN_ACCESS_CONTROL: {
      before: [
        {
          name: 'should detect missing authorization check',
          user: 'unauthorized_user',
          resource: 'protected_resource',
          expected: 'vulnerability_detected',
          description: 'Unauthorized access should be prevented'
        }
      ],
      after: [
        {
          name: 'should enforce authorization checks',
          user: 'unauthorized_user',
          resource: 'protected_resource',
          expected: 'access_denied',
          description: 'Authorization should be enforced'
        },
        {
          name: 'should allow authorized access',
          user: 'authorized_user',
          resource: 'protected_resource',
          expected: 'access_granted',
          description: 'Legitimate access should work'
        }
      ]
    },
    SSRF: {
      before: [
        {
          name: 'should detect SSRF vulnerability',
          url: 'http://169.254.169.254/latest/meta-data/',
          expected: 'vulnerability_detected',
          description: 'Internal IP access should be blocked'
        }
      ],
      after: [
        {
          name: 'should block internal IP ranges',
          url: 'http://169.254.169.254/latest/meta-data/',
          expected: 'blocked',
          description: 'Internal IPs should be rejected'
        },
        {
          name: 'should allow whitelisted external URLs',
          url: 'https://api.example.com/data',
          expected: 'allowed',
          description: 'Valid external URLs should work'
        }
      ]
    },
    AUTHENTICATION_FAILURE: {
      before: [
        {
          name: 'should detect weak authentication',
          password: 'plain_text_comparison',
          expected: 'vulnerability_detected',
          description: 'Weak auth should be flagged'
        }
      ],
      after: [
        {
          name: 'should use secure password hashing',
          password: 'bcrypt_comparison',
          expected: 'pass',
          description: 'Strong hashing should be used'
        },
        {
          name: 'should set JWT expiration',
          token: 'jwt_with_expiry',
          expected: 'pass',
          description: 'Tokens should expire'
        }
      ]
    },
    SECURITY_MISCONFIGURATION: {
      before: [
        {
          name: 'should detect insecure CORS configuration',
          origin: '*',
          expected: 'vulnerability_detected',
          description: 'Wildcard CORS should be flagged'
        }
      ],
      after: [
        {
          name: 'should use restricted CORS policy',
          origin: 'https://trusted-domain.com',
          expected: 'pass',
          description: 'CORS should be restricted'
        }
      ]
    },
    INTEGRITY_FAILURE: {
      before: [
        {
          name: 'should detect eval usage',
          code: 'eval(userInput)',
          expected: 'vulnerability_detected',
          description: 'eval should be prevented'
        }
      ],
      after: [
        {
          name: 'should use safe alternatives to eval',
          code: 'JSON.parse(validatedInput)',
          expected: 'pass',
          description: 'Safe parsing should be used'
        }
      ]
    },
    INSECURE_DESIGN: {
      before: [
        {
          name: 'should detect missing authentication',
          endpoint: '/api/sensitive',
          auth: false,
          expected: 'vulnerability_detected',
          description: 'Unprotected endpoints should be flagged'
        }
      ],
      after: [
        {
          name: 'should require authentication',
          endpoint: '/api/sensitive',
          auth: true,
          expected: 'pass',
          description: 'Authentication should be required'
        }
      ]
    },
    VULNERABLE_COMPONENT: {
      before: [
        {
          name: 'should detect deprecated package',
          package: 'moment',
          expected: 'vulnerability_detected',
          description: 'Deprecated packages should be flagged'
        }
      ],
      after: [
        {
          name: 'should use maintained alternative',
          package: 'date-fns',
          expected: 'pass',
          description: 'Modern packages should be used'
        }
      ]
    },
    LOGGING_FAILURE: {
      before: [
        {
          name: 'should detect missing error logging',
          error_handling: 'empty_catch',
          expected: 'vulnerability_detected',
          description: 'Errors should be logged'
        }
      ],
      after: [
        {
          name: 'should log errors properly',
          error_handling: 'logged_catch',
          expected: 'pass',
          description: 'Error logging should be implemented'
        }
      ]
    }
  };

  const template = testTemplates[vulnerability.type] || {
    before: [{ name: 'generic_vulnerability_test', expected: 'vulnerability_detected' }],
    after: [{ name: 'generic_fix_test', expected: 'pass' }]
  };

  return {
    vulnerability_id: `${vulnerability.file}:${vulnerability.line}`,
    type: vulnerability.type,
    severity: vulnerability.severity,
    test_suite: {
      before_fix: template.before,
      after_fix: template.after
    },
    metadata: {
      file: vulnerability.file,
      line: vulnerability.line,
      confidence: vulnerability.confidence
    }
  };
}

function generateRemediationPlan(vulnerabilities, repoFiles) {
  const plan = {
    total_vulnerabilities: vulnerabilities.length,
    remediation_items: [],
    estimated_effort: 0
  };

  const fileContentMap = {};
  repoFiles.forEach(f => {
    fileContentMap[f.file] = f.content;
  });

  vulnerabilities.forEach(vuln => {
    const fileContent = fileContentMap[vuln.file] || '';
    
    const remediationItem = {
      vulnerability: vuln,
      bob_prompt: generateRemediationPrompt(vuln, fileContent),
      test_cases: generateTestCaseTemplate(vuln),
      priority: calculatePriority(vuln),
      estimated_time_minutes: estimateEffort(vuln)
    };

    plan.remediation_items.push(remediationItem);
    plan.estimated_effort += remediationItem.estimated_time_minutes;
  });

  plan.remediation_items.sort((a, b) => b.priority - a.priority);

  return plan;
}

function calculatePriority(vulnerability) {
  const severityWeight = {
    CRITICAL: 100,
    HIGH: 75,
    MEDIUM: 50,
    LOW: 25
  };

  const baseScore = severityWeight[vulnerability.severity] || 0;
  const confidenceMultiplier = vulnerability.confidence || 1.0;
  
  return Math.round(baseScore * confidenceMultiplier);
}

function estimateEffort(vulnerability) {
  const effortMap = {
    INJECTION: 30,
    CRYPTOGRAPHIC_FAILURE: 20,
    BROKEN_ACCESS_CONTROL: 45,
    SECURITY_MISCONFIGURATION: 15,
    AUTHENTICATION_FAILURE: 35,
    SSRF: 25,
    INSECURE_DESIGN: 40,
    VULNERABLE_COMPONENT: 10,
    LOGGING_FAILURE: 10,
    INTEGRITY_FAILURE: 30
  };

  return effortMap[vulnerability.type] || 20;
}

module.exports = {
  generateRemediationPrompt,
  generateTestCaseTemplate,
  generateRemediationPlan,
  calculatePriority,
  estimateEffort
};