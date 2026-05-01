const { scanFiles } = require("../../security_rules");
const { calculateImpact } = require("../../security_rules/impact");
const { formatResponse } = require("./formatResponse");
const { generateRemediationPlan } = require("./remediation");

function runAuditWithRemediation(repoFiles) {
  const vulnerabilities = scanFiles(repoFiles);
  const impact = calculateImpact(vulnerabilities);
  const baseResponse = formatResponse(vulnerabilities, impact);
  
  const remediationPlan = generateRemediationPlan(vulnerabilities, repoFiles);
  
  return {
    ...baseResponse,
    remediation: {
      total_items: remediationPlan.total_vulnerabilities,
      estimated_effort_minutes: remediationPlan.estimated_effort,
      estimated_effort_hours: Math.round(remediationPlan.estimated_effort / 60 * 10) / 10,
      items: remediationPlan.remediation_items.map(item => ({
        vulnerability_id: `${item.vulnerability.file}:${item.vulnerability.line}`,
        type: item.vulnerability.type,
        severity: item.vulnerability.severity,
        file: item.vulnerability.file,
        line: item.vulnerability.line,
        priority: item.priority,
        estimated_time_minutes: item.estimated_time_minutes,
        bob_prompt: item.bob_prompt,
        test_cases: item.test_cases
      }))
    }
  };
}

module.exports = { runAuditWithRemediation };