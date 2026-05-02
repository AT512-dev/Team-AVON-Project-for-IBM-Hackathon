'use strict';

const BASE_COST = {
  CRITICAL: 150_000,
  HIGH: 40_000,
  MEDIUM: 10_000,
  LOW: 1_500,
};

const LIKELIHOOD = {
  CRITICAL: 0.90,
  HIGH: 0.65,
  MEDIUM: 0.35,
  LOW: 0.10,
};

const REMEDIATION_SPEED_BONUS = 10;

function calculateImpact(vulnerabilities) {
  const breakdown = vulnerabilities.map((v) => {
    // Normalize severity to uppercase for consistent matching
    const severity       = v.severity?.toUpperCase();
    const baseCost       = BASE_COST[severity]  ?? 0;
    const likelihood     = LIKELIHOOD[severity] ?? 0;
    const perVulnerability = baseCost * likelihood * REMEDIATION_SPEED_BONUS;

    return {
      severity,
      file:              v.file ?? 'unknown',
      issue:             v.issue ?? '',
      perVulnerability:  Math.round(perVulnerability),
    };
  });

  const totalSaved = breakdown.reduce((sum, b) => sum + b.perVulnerability, 0);

  return {
    totalSaved,
    breakdown,
    formattedTotal: formatCurrency(totalSaved),
  };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

if (require.main === module) {
  const mockVulnerabilities = [
    { severity: 'CRITICAL', file: 'src/auth.js',   issue: 'Hardcoded API secret' },
    { severity: 'HIGH',     file: 'src/db.py',     issue: 'SQL Injection' },
    { severity: 'HIGH',     file: 'src/server.js', issue: 'XSS via innerHTML' },
    { severity: 'MEDIUM',   file: 'src/api/users.js', issue: 'Missing rate limiting' },
    { severity: 'LOW',      file: 'package.json',  issue: 'Outdated lodash dependency' },
  ];

  const result = calculateImpact(mockVulnerabilities);

  console.log('\nCodeGuard AI — Impact Analysis\n');
  console.log('  Per-vulnerability savings:');
  result.breakdown.forEach((b) => {
    const pad = (s, n) => s.padEnd(n);
    console.log(
      `   ${pad('[' + b.severity + ']', 12)}` +
      `${pad(b.file, 30)}` +
      `→  ${formatCurrency(b.perVulnerability)}`
    );
  });
  console.log('\n  ' + '─'.repeat(50));
  console.log(`  Estimated Total Saved:  ${result.formattedTotal}`);
  console.log('  ' + '─'.repeat(50) + '\n');
}

module.exports = { calculateImpact, BASE_COST, LIKELIHOOD, REMEDIATION_SPEED_BONUS };
