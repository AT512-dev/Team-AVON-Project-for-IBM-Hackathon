'use strict';

const { Router } = require('express');
const { validateAuditRequest } = require('../middleware/validateAuditRequest');
const { validateRepoRequest } = require('../middleware/validateRepoRequest');
const {
  unifiedScan,
  runAudit,
  runAuditWithRemediation,
  getDemoAudit,
  getVulnerabilitiesBySeverity,
  getMetrics,
  runAuditOnClonedRepo
} = require('../controllers/auditController');
const gitController = require('../controllers/gitController');

const router = Router();

// ============================================
// UNIFIED SCAN ENDPOINT (Demo + Live Mode)
// ============================================
// This is the main endpoint that handles both demo and live scans
// Request body should include:
// - isDemoMode: boolean (true for demo, false for live)
// - repoUrl: string (required for live mode)
// - includeRemediation: boolean (optional, default false)
router.post('/scan', unifiedScan);

// Repository fetching endpoints
router.post('/fetch-repo', validateRepoRequest, gitController.fetchRepository.bind(gitController));
router.delete('/workspace/:workspaceId', gitController.cleanupWorkspace.bind(gitController));
router.post('/cleanup-old-workspaces', gitController.cleanupOldWorkspaces.bind(gitController));
router.get('/git/health', gitController.healthCheck.bind(gitController));

// Core audit endpoints (legacy - kept for backward compatibility)
router.post('/audit', validateAuditRequest, runAudit);
router.post('/audit/remediation', validateAuditRequest, runAuditWithRemediation);
router.post('/audit/scan-repo', runAuditOnClonedRepo);

// Demo and utility endpoints
router.get('/demo', getDemoAudit);
router.get('/metrics', getMetrics);
router.get('/vulnerabilities/:severity', getVulnerabilitiesBySeverity);

module.exports = router;
