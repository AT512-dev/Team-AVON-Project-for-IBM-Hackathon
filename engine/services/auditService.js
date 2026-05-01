'use strict';

const ibmBobClient = require('../config/ibmBobClient');

function calculateOverallScore(vulnerabilities) {
  const SEVERITY_WEIGHTS = {
    critical:30,
    high:15,
    medium:7,
    low:2,
  };

  const totalDeduction = vulnerabilities.reduce((sum, v) => {
    return sum + (SEVERITY_WEIGHTS[v.severity] ?? 0);
  }, 0);

  const score = Math.max(0, 100 - Math.min(totalDeduction, 100));
  return Math.round(score);
}

async function performAudit(repoPath) {
  const ibmBobResponse = await ibmBobClient.scan({
    path: repoPath,
    scanType: 'security',
    language: 'auto-detect'
  });

  const vulnerabilities = ibmBobResponse.findings.map(finding => ({
    severity: finding.severity.toLowerCase(),
    file: finding.location.file,
    line: finding.location.line,
    issue: finding.title,
    fix: finding.recommendation
  }));

  return {
    overallScore: calculateOverallScore(vulnerabilities),
    vulnerabilitiesFound: vulnerabilities,
    auditTimestamp: new Date().toISOString()
  };
}

module.exports = { performAudit };

