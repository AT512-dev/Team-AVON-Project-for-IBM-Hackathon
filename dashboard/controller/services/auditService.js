'use strict';

const { calculateScore } = require('../utils/scoring');

async function performAudit(repoPath) {
  await simulateLatency(400, 900);
  const vulnerabilities = getMockVulnerabilities(repoPath);

  const overallScore = calculateScore(vulnerabilities);

  return {
    repoPath,
    overallScore,
    vulnerabilitiesFound: vulnerabilities,
    auditTimestamp: new Date().toISOString(),
  };
}

function getMockVulnerabilities(repoPath) {
  return [
    {
      severity: 'CRITICAL',
      file: `${repoPath}/src/auth.js`,
      line: 12,
      issue: 'Hardcoded API secret detected in source code.',
      fix: 'Move secrets to environment variables (process.env.API_SECRET) and rotate the exposed key immediately.',
    },
    {
      severity: 'HIGH',
      file: `${repoPath}/src/db.py`,
      line: 34,
      issue: 'SQL Injection vulnerability: user input concatenated directly into query string.',
      fix: 'Use parameterised queries or a prepared statement library (e.g. psycopg2\'s %s placeholders).',
    },
    {
      severity: 'HIGH',
      file: `${repoPath}/src/server.js`,
      line: 58,
      issue: 'Cross-Site Scripting (XSS): unsanitised user input rendered via innerHTML.',
      fix: 'Use textContent instead of innerHTML, or sanitise with DOMPurify before rendering.',
    },
    {
      severity: 'MEDIUM',
      file: `${repoPath}/src/api/users.js`,
      line: 22,
      issue: 'Missing rate limiting on authentication endpoint — brute-force attack vector.',
      fix: 'Apply express-rate-limit middleware to /login and /register routes.',
    },
    {
      severity: 'LOW',
      file: `${repoPath}/package.json`,
      line: 1,
      issue: 'Dependency "lodash@4.17.15" has a known prototype pollution vulnerability (CVE-2020-8203).',
      fix: 'Upgrade lodash to >= 4.17.21 by running: npm update lodash',
    },
  ];
}

function simulateLatency(minMs, maxMs) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

module.exports = { performAudit };
