'use strict';

const SEVERITY_WEIGHTS = {
  CRITICAL: 30,
  HIGH: 15,
  MEDIUM: 7,
  LOW: 2,
};

const MAX_DEDUCTION = 100;

function calculateScore(vulnerabilities) {
  const totalDeduction = vulnerabilities.reduce((sum, v) => {
    // Normalize severity to uppercase for consistent matching
    const severity = v.severity?.toUpperCase();
    return sum + (SEVERITY_WEIGHTS[severity] ?? 0);
  }, 0);

  const score = Math.max(0, 100 - Math.min(totalDeduction, MAX_DEDUCTION));
  return Math.round(score);
}

module.exports = { calculateScore, SEVERITY_WEIGHTS };
