'use strict';

function validateAuditRequest(req, res, next) {
  const { repoPath, files } = req.body ?? {};

  // Accept either repoPath (string) or files (array)
  if (!repoPath && !files) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: 'Either `repoPath` (string) or `files` (array) is required.',
    });
  }

  // Validate repoPath if provided
  if (repoPath) {
    if (typeof repoPath !== 'string' || repoPath.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: '`repoPath` must be a non-empty string.',
      });
    }
    req.body.repoPath = repoPath.trim().replace(/\/+$/, '');
  }

  // Validate files if provided
  if (files) {
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: '`files` must be a non-empty array.',
      });
    }

    // Validate each file object
    for (const file of files) {
      if (!file.file || !file.content) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: 'Each file must have `file` (filename) and `content` properties.',
        });
      }
    }
  }

  next();
}

module.exports = { validateAuditRequest };

