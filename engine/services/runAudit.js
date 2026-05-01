/**
 * CORE AUDIT PIPELINE
 * Orchestrates the complete security audit flow
 */

const { scanFiles } = require("../../security_rules");
const { calculateImpact } = require("../../security_rules/impact");
const { formatResponse } = require("./formatResponse");

/**
 * Run complete security audit on repository files
 * @param {Array} repoFiles - Array of file objects with {file, content}
 * @returns {Object} Formatted audit results with vulnerabilities and impact
 */
function runAudit(repoFiles) {
  // 1. Detect vulnerabilities using OWASP scanner
  const vulnerabilities = scanFiles(repoFiles);

  // 2. Compute business impact ($ savings)
  const impact = calculateImpact(vulnerabilities);

  // 3. Format final output for frontend/demo
  return formatResponse(vulnerabilities, impact);
}

module.exports = { runAudit };
