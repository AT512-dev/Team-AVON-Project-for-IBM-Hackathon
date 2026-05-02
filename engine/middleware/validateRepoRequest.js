'use strict';

/**
 * Middleware to validate repository fetch requests
 * 
 * Validates:
 * - Request body structure
 * - Repository URL format
 * - Request size limits
 */
const validateRepoRequest = (req, res, next) => {
  try {
    const { repoUrl } = req.body;

    // Check if repoUrl exists
    if (!repoUrl) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Missing required field: repoUrl',
        field: 'repoUrl'
      });
    }

    // Check if repoUrl is a string
    if (typeof repoUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'repoUrl must be a string',
        field: 'repoUrl'
      });
    }

    // Check URL length (prevent extremely long URLs)
    if (repoUrl.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Repository URL is too long (max 500 characters)',
        field: 'repoUrl'
      });
    }

    // Check for empty or whitespace-only URLs
    if (repoUrl.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Repository URL cannot be empty',
        field: 'repoUrl'
      });
    }

    // Basic URL format check (more detailed validation in service)
    const urlPattern = /^(https?:\/\/|git@)/i;
    if (!urlPattern.test(repoUrl.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Repository URL must start with https://, http://, or git@',
        field: 'repoUrl'
      });
    }

    // Check for dangerous characters (basic check, detailed in service)
    const dangerousChars = /[;&|`$(){}[\]<>]/;
    if (dangerousChars.test(repoUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Repository URL contains invalid characters',
        field: 'repoUrl'
      });
    }

    // Validation passed
    next();

  } catch (error) {
    console.error('[validateRepoRequest] Validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Validation error',
      message: 'An error occurred during request validation'
    });
  }
};

module.exports = { validateRepoRequest };

// Made with Bob
