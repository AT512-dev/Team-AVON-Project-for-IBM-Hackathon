'use strict';

const { runAudit } = require('./runAudit');
const { runAuditWithRemediation } = require('./runAuditWithRemediation');

/**
 * Calculate overall security score based on vulnerabilities
 * @param {Array} vulnerabilities - List of detected vulnerabilities
 * @returns {Number} Score from 0-100
 */
function calculateOverallScore(vulnerabilities) {
  const SEVERITY_WEIGHTS = {
    CRITICAL: 30,
    HIGH: 15,
    MEDIUM: 7,
    LOW: 2,
  };

  const totalDeduction = vulnerabilities.reduce((sum, v) => {
    return sum + (SEVERITY_WEIGHTS[v.severity] ?? 0);
  }, 0);

  const score = Math.max(0, 100 - Math.min(totalDeduction, 100));
  return Math.round(score);
}

/**
 * Perform security audit on repository files
 * @param {String|Array} repoPath - Path to repo or array of file objects
 * @param {Object} options - Audit options
 * @returns {Object} Audit results with vulnerabilities and impact
 */
async function performAudit(repoPath, options = {}) {
  // If repoPath is an array, it's already parsed files
  const repoFiles = Array.isArray(repoPath) ? repoPath : parseRepoFiles(repoPath);
  
  // Run OWASP static analysis
  const auditResult = runAudit(repoFiles);
  
  // Add overall score
  auditResult.overallScore = calculateOverallScore(auditResult.vulnerabilities);
  auditResult.auditTimestamp = new Date().toISOString();
  
  return auditResult;
}

/**
 * Perform audit with Bob remediation suggestions
 * @param {String|Array} repoPath - Path to repo or array of file objects
 * @returns {Object} Audit results with remediation prompts
 */
async function performAuditWithRemediation(repoPath) {
  const repoFiles = Array.isArray(repoPath) ? repoPath : parseRepoFiles(repoPath);
  
  const auditResult = runAuditWithRemediation(repoFiles);
  
  auditResult.overallScore = calculateOverallScore(auditResult.vulnerabilities);
  auditResult.auditTimestamp = new Date().toISOString();
  
  return auditResult;
}

/**
 * Parse repository path into file objects (placeholder)
 * In production, this would read files from filesystem
 */
function parseRepoFiles(repoPath) {
  // TODO: Implement file system reading
  // For now, return mock data
  const { mockRepo } = require('./mockRepo');
  return mockRepo;
}

module.exports = {
  performAudit,
  performAuditWithRemediation,
  calculateOverallScore
};

