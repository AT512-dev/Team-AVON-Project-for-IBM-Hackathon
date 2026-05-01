'use strict';

const SEVERITY_WEIGHTS = {
  critical:30,
  high:15,
  medium:7,
  low:2,
};

const MAX_DEDUCTION = 100;

function calculateScore(vulnerabilities) {
  const totalDeduction = vulnerabilities.reduce((sum, v) => {
    return sum + (SEVERITY_WEIGHTS[v.severity] ?? 0);
  }, 0);

  const score = Math.max(0, 100 - Math.min(totalDeduction, MAX_DEDUCTION));
  return Math.round(score);
}

module.exports = { calculateScore, SEVERITY_WEIGHTS };
