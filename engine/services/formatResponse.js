function generateInsights(vulnerabilities) {
  const insights = [];
  
  const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'HIGH').length;
  
  if (criticalCount > 0) {
    insights.push(`Found ${criticalCount} critical vulnerabilities requiring immediate attention`);
  }
  
  const typeCount = {};
  vulnerabilities.forEach(v => {
    typeCount[v.type] = (typeCount[v.type] || 0) + 1;
  });
  
  const topIssue = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];
  if (topIssue) {
    insights.push(`Most common issue: ${topIssue[0]} (${topIssue[1]} occurrences)`);
  }
  
  const injectionIssues = vulnerabilities.filter(v => v.type === 'INJECTION').length;
  if (injectionIssues > 0) {
    insights.push(`Injection vulnerabilities detected - implement input validation and parameterized queries`);
  }
  
  const cryptoIssues = vulnerabilities.filter(v => v.type === 'CRYPTOGRAPHIC_FAILURE').length;
  if (cryptoIssues > 0) {
    insights.push(`Cryptographic issues found - review secret management and hashing algorithms`);
  }
  
  const avgConfidence = vulnerabilities.reduce((sum, v) => sum + (v.confidence || 1), 0) / vulnerabilities.length;
  if (avgConfidence > 0.85) {
    insights.push(`High confidence detections (${Math.round(avgConfidence * 100)}% average) - prioritize remediation`);
  }
  
  return insights;
}

function formatResponse(vulnerabilities, impact) {
  return {
    scan_summary: {
      total_issues: vulnerabilities.length,
      critical: vulnerabilities.filter(v => v.severity === "CRITICAL").length,
      high: vulnerabilities.filter(v => v.severity === "HIGH").length,
      medium: vulnerabilities.filter(v => v.severity === "MEDIUM").length,
      low: vulnerabilities.filter(v => v.severity === "LOW").length
    },

    vulnerabilities,

    impact: {
      estimated_savings_usd: impact.estimated_savings,
      risk_score_total: impact.risk_score_total,
      breakdown: impact.breakdown
    },

    insights: generateInsights(vulnerabilities),

    meta: {
      engine: "CodeGuard AI",
      version: "1.0",
      mode: "OWASP Static Analysis"
    }
  };
}

module.exports = { formatResponse };
