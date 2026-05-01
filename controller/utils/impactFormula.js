'use strict';

const BASE_COST = {
  critical:150_000,
  high:40_000,
  medium:10_000,
  low:1_500,
};

const LIKELIHOOD = {
  critical:0.90,
  high:0.65,
  medium:0.35,
  low:0.10,
};

const REMEDIATION_SPEED_BONUS = 10;

function calculateImpact(vulnerabilities) {
  const breakdown = vulnerabilities.map((v) => {
    const severity       = v.severity.toLowerCase();
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
    { severity: 'critical', file: 'src/auth.js',   issue: 'Hardcoded API secret' },
    { severity: 'high',     file: 'src/db.py',     issue: 'SQL Injection' },
    { severity: 'high',     file: 'src/server.js', issue: 'XSS via innerHTML' },
    { severity: 'medium',   file: 'src/api/users.js', issue: 'Missing rate limiting' },
    { severity: 'low',      file: 'package.json',  issue: 'Outdated lodash dependency' },
  ];

  const result = calculateImpact(mockVulnerabilities);

  console.log('\nCodeGuard AI — Impact Analysis\n');
  console.log('  Per-vulnerability savings:');
  result.breakdown.forEach((b) => {
    const pad = (s, n) => s.padEnd(n);
    console.log(
      `   ${pad('[' + b.severity.toUpperCase() + ']', 12)}` +
      `${pad(b.file, 30)}` +
      `→  ${formatCurrency(b.perVulnerability)}`
    );
  });
  console.log('\n  ' + '─'.repeat(50));
  console.log(`  Estimated Total Saved:  ${result.formattedTotal}`);
  console.log('  ' + '─'.repeat(50) + '\n');
}

module.exports = { calculateImpact, BASE_COST, LIKELIHOOD, REMEDIATION_SPEED_BONUS };
