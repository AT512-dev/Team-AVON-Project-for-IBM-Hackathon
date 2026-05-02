'use strict';

const { Router } = require('express');
const { validateAuditRequest } = require('../middleware/validateAuditRequest');
const {
  runAudit,
  runAuditWithRemediation,
  getDemoAudit,
  getVulnerabilitiesBySeverity,
  getMetrics
} = require('../controllers/auditController');

const router = Router();

// Core audit endpoints
router.post('/audit', validateAuditRequest, runAudit);
router.post('/audit/remediation', validateAuditRequest, runAuditWithRemediation);

// Demo and utility endpoints
router.get('/demo', getDemoAudit);
router.get('/metrics', getMetrics);
router.get('/vulnerabilities/:severity', getVulnerabilitiesBySeverity);

module.exports = router;
