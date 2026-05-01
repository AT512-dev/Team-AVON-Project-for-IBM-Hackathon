'use strict';

function validateAuditRequest(req, res, next) {
  const { repoPath } = req.body ?? {};

  if (!repoPath || typeof repoPath !== 'string' || repoPath.trim() === '') {
    return res.status(400).json({
      success: false,
      error:   'Validation failed',
      details: '`repoPath` is required and must be a non-empty string.',
    });
  }

  req.body.repoPath = repoPath.trim().replace(/\/+$/, '');

  next();
}

module.exports = { validateAuditRequest };

