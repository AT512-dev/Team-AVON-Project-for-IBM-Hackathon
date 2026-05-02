'use strict';

const auditService = require('../services/auditService');
const gitService = require('../services/gitService');

/**
 * UNIFIED SCAN ENDPOINT - Handles both Demo and Live modes
 * This is the main entry point that switches between mock data and real scanning
 */
async function unifiedScan(req, res, next) {
  try {
    // Accept both flag conventions:
    //   { isDemoMode: true }   → demo path (mock repo)
    //   { isDemoMode: false }  → live path (real scan + WatsonX)
    //   { isLive: true }       → explicit live-mode override
    const { repoUrl, isDemoMode, isLive, includeRemediation } = req.body;

    // LOGIC GATE: Demo Mode vs Live Mode
    // Only an explicit isDemoMode === true triggers mock data.
    // Missing, null, or false always executes the real audit.
    // isLive: true also forces the live path even if isDemoMode is omitted.
    const liveMode = isLive === true || isDemoMode === false;
    if (isDemoMode === true && isLive !== true) {
      // DEMO MODE: Use mock repository
      console.log('[SCAN] Running in DEMO MODE');
      const { mockRepo } = require('../services/mockRepo');
      
      const result = includeRemediation
        ? await auditService.performAuditWithRemediation(mockRepo)
        : await auditService.performAudit(mockRepo);

      return res.status(200).json({
        success: true,
        mode: 'demo',
        data: result,
        message: 'Demo scan completed using sample vulnerable code'
      });
    } else {
      // LIVE MODE: Real repository scan with WatsonX
      console.log('[SCAN] Running in LIVE MODE');
      
      // Validate URL
      if (!repoUrl || typeof repoUrl !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Repository URL is required for live mode',
          message: 'Please provide a valid GitHub/GitLab repository URL'
        });
      }

      // Validate Git URL format
      if (!gitService.validateGitUrl(repoUrl)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid repository URL',
          message: 'Please provide a valid GitHub, GitLab, or Bitbucket repository URL (HTTPS format recommended)'
        });
      }

      // Step 1: Clone the repository
      console.log(`[SCAN] Cloning repository: ${repoUrl}`);
      let fetchResult;
      try {
        fetchResult = await gitService.fetchRepository(repoUrl);
      } catch (cloneError) {
        return res.status(400).json({
          success: false,
          error: 'Failed to clone repository',
          message: cloneError.message,
          details: 'Please ensure the repository URL is correct and publicly accessible'
        });
      }

      const { workspacePath, workspaceId } = fetchResult;

      try {
        // Step 2: Perform real audit with WatsonX integration
        console.log(`[SCAN] Scanning cloned repository at: ${workspacePath}`);
        
        const result = includeRemediation
          ? await auditService.performAuditWithRemediationLive(workspacePath)
          : await auditService.performAuditLive(workspacePath);

        // Step 3: Cleanup workspace (optional - can be done async)
        setTimeout(() => {
          gitService.cleanupWorkspace(workspacePath).catch(err =>
            console.error('[SCAN] Cleanup error:', err)
          );
        }, 5000); // Cleanup after 5 seconds

        return res.status(200).json({
          success: true,
          mode: 'live',
          data: result,
          metadata: {
            repoUrl,
            workspaceId,
            filesScanned: result.filesScanned,
            scanTimestamp: result.auditTimestamp
          },
          message: `Live scan completed: analyzed ${result.filesScanned} files from ${repoUrl}`
        });
      } catch (scanError) {
        // Cleanup on scan failure
        await gitService.cleanupWorkspace(workspacePath);
        throw scanError;
      }
    }
  } catch (err) {
    next(err);
  }
}

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

/**
 * Run security audit on a cloned repository
 * This endpoint accepts a workspacePath from the git service
 */
async function runAuditOnClonedRepo(req, res, next) {
  try {
    const { workspacePath, includeRemediation } = req.body;

    if (!workspacePath) {
      return res.status(400).json({
        success: false,
        error: 'workspacePath is required'
      });
    }

    // Perform audit on the cloned repository
    const result = includeRemediation
      ? await auditService.performAuditWithRemediation(workspacePath)
      : await auditService.performAudit(workspacePath);

    return res.status(200).json({
      success: true,
      data: result,
      message: `Successfully scanned ${result.filesScanned} files from cloned repository`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  unifiedScan,
  runAudit,
  runAuditWithRemediation,
  getDemoAudit,
  getVulnerabilitiesBySeverity,
  getMetrics,
  runAuditOnClonedRepo
};


