'use strict';

const auditService = require('../services/auditService');

/**
 * Run security audit on repository
 */
async function runAudit(req, res, next) {
  try {
    const { repoPath, files } = req.body;

    const result = await auditService.performAudit(repoPath || files);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Run security audit with Bob remediation suggestions
 */
async function runAuditWithRemediation(req, res, next) {
  try {
    const { repoPath, files } = req.body;

    const result = await auditService.performAuditWithRemediation(repoPath || files);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get demo audit results using mock repository
 */
async function getDemoAudit(req, res, next) {
  try {
    const { mockRepo } = require('../services/mockRepo');
    const result = await auditService.performAudit(mockRepo);

    return res.status(200).json({
      success: true,
      data: result,
      note: "Demo results using mock vulnerable code"
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get vulnerabilities filtered by severity
 */
async function getVulnerabilitiesBySeverity(req, res, next) {
  try {
    const { severity } = req.params;
    const { mockRepo } = require('../services/mockRepo');
    
    const result = await auditService.performAudit(mockRepo);
    const filtered = result.vulnerabilities.filter(v =>
      v.severity === severity.toUpperCase()
    );

    return res.status(200).json({
      success: true,
      data: {
        severity: severity.toUpperCase(),
        count: filtered.length,
        vulnerabilities: filtered
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get time-saved metrics
 */
async function getMetrics(req, res, next) {
  try {
    const { mockRepo } = require('../services/mockRepo');
    const result = await auditService.performAudit(mockRepo);

    const manualReviewMinutes = result.vulnerabilities.length * 15;
    const automatedScanMinutes = 2;
    const timeSavedMinutes = manualReviewMinutes - automatedScanMinutes;

    return res.status(200).json({
      success: true,
      data: {
        total_vulnerabilities: result.vulnerabilities.length,
        manual_review_time_minutes: manualReviewMinutes,
        automated_scan_time_minutes: automatedScanMinutes,
        time_saved_minutes: timeSavedMinutes,
        time_saved_hours: Math.round(timeSavedMinutes / 60 * 10) / 10,
        efficiency_improvement: `${Math.round((timeSavedMinutes / manualReviewMinutes) * 100)}%`
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  runAudit,
  runAuditWithRemediation,
  getDemoAudit,
  getVulnerabilitiesBySeverity,
  getMetrics
};


