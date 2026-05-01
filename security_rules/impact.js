const severityValue = {
  CRITICAL: 5000,
  HIGH: 2000,
  MEDIUM: 500,
  LOW: 100
};

function calculateImpact(vulnerabilities) {
  let totalRiskScore = 0;
  let totalEstimatedSavings = 0;

  const breakdown = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  };

  for (const v of vulnerabilities) {
    breakdown[v.severity]++;
    
    const baseValue = severityValue[v.severity] || 0;
    const confidence = v.confidence || 1.0;
    const riskAdjustedValue = baseValue * confidence;
    
    totalRiskScore += riskAdjustedValue;
    totalEstimatedSavings += baseValue;
  }

  return {
    total_vulnerabilities: vulnerabilities.length,
    breakdown,
    estimated_savings: Math.round(totalEstimatedSavings),
    risk_score_total: Math.round(totalRiskScore)
  };
}

module.exports = { calculateImpact };
