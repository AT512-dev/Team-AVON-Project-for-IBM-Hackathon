'use strict';

const { Router } = require('express');
const { validateAuditRequest } = require('../middleware/validateAuditRequest');
const { runAudit }             = require('../controllers/auditController');

const router = Router();

router.post('/audit', validateAuditRequest, runAudit);

module.exports = router;
