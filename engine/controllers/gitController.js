'use strict';

const gitService = require('../services/gitService');

/**
 * GitController - Handles repository fetching endpoints
 * 
 * Provides secure API endpoints for cloning and managing Git repositories
 */
class GitController {
  /**
   * Fetch repository endpoint
   * POST /api/v1/fetch-repo
   * 
   * Request body:
   * {
   *   "repoUrl": "https://github.com/user/repo.git"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "workspaceId": "uuid",
   *   "workspacePath": "/path/to/workspace",
   *   "repoUrl": "https://github.com/user/repo.git",
   *   "fileCount": 42,
   *   "message": "Repository fetched successfully",
   *   "timestamp": "2026-05-02T16:00:00.000Z"
   * }
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  async fetchRepository(req, res, next) {
    try {
      const { repoUrl } = req.body;

      // Validate request body
      if (!repoUrl) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: repoUrl',
          message: 'Please provide a repository URL'
        });
      }

      // Log request (sanitized)
      console.log(`[GitController] Fetch request received for repository`);

      // Fetch repository using secure service
      const result = await gitService.fetchRepository(repoUrl);

      // Log success
      console.log(`[GitController] Repository fetched successfully: ${result.workspaceId}`);

      // Return success response
      return res.status(200).json(result);

    } catch (error) {
      console.error('[GitController] Fetch failed:', error.message);

      // Handle specific error types
      if (error.message.includes('Invalid or potentially unsafe')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid repository URL',
          message: 'The provided URL is not a valid or safe Git repository URL',
          details: error.message
        });
      }

      if (error.message.includes('timed out')) {
        return res.status(408).json({
          success: false,
          error: 'Request timeout',
          message: 'Repository cloning took too long. Please try again or use a smaller repository',
          details: error.message
        });
      }

      if (error.message.includes('Git clone failed')) {
        return res.status(400).json({
          success: false,
          error: 'Clone failed',
          message: 'Failed to clone repository. Please check the URL and ensure the repository is accessible',
          details: error.message
        });
      }

      // Generic error
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching the repository',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Cleanup workspace endpoint
   * DELETE /api/v1/workspace/:workspaceId
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  async cleanupWorkspace(req, res, next) {
    try {
      const { workspaceId } = req.params;

      if (!workspaceId) {
        return res.status(400).json({
          success: false,
          error: 'Missing workspace ID',
          message: 'Please provide a workspace ID'
        });
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(workspaceId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid workspace ID',
          message: 'Workspace ID must be a valid UUID'
        });
      }

      // Construct workspace path
      const path = require('path');
      const os = require('os');
      const workspacePath = path.join(os.tmpdir(), 'codeguard-repos', workspaceId);

      // Cleanup workspace
      await gitService.cleanupWorkspace(workspacePath);

      console.log(`[GitController] Workspace cleaned up: ${workspaceId}`);

      return res.status(200).json({
        success: true,
        message: 'Workspace cleaned up successfully',
        workspaceId
      });

    } catch (error) {
      console.error('[GitController] Cleanup failed:', error.message);

      return res.status(500).json({
        success: false,
        error: 'Cleanup failed',
        message: 'Failed to cleanup workspace',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Cleanup old workspaces endpoint
   * POST /api/v1/cleanup-old-workspaces
   * 
   * Request body (optional):
   * {
   *   "hoursOld": 24
   * }
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   */
  async cleanupOldWorkspaces(req, res, next) {
    try {
      const { hoursOld = 24 } = req.body;

      // Validate hoursOld
      if (typeof hoursOld !== 'number' || hoursOld < 1 || hoursOld > 168) {
        return res.status(400).json({
          success: false,
          error: 'Invalid hoursOld parameter',
          message: 'hoursOld must be a number between 1 and 168 (1 week)'
        });
      }

      console.log(`[GitController] Cleaning up workspaces older than ${hoursOld} hours`);

      const cleaned = await gitService.cleanupOldWorkspaces(hoursOld);

      console.log(`[GitController] Cleaned up ${cleaned} old workspaces`);

      return res.status(200).json({
        success: true,
        message: `Cleaned up ${cleaned} old workspace(s)`,
        cleaned,
        threshold: `${hoursOld} hours`
      });

    } catch (error) {
      console.error('[GitController] Old workspace cleanup failed:', error.message);

      return res.status(500).json({
        success: false,
        error: 'Cleanup failed',
        message: 'Failed to cleanup old workspaces',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Health check for Git service
   * GET /api/v1/git/health
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async healthCheck(req, res) {
    try {
      const { spawn } = require('child_process');

      // Check if git is available
      const gitCheck = await new Promise((resolve) => {
        const git = spawn('git', ['--version']);
        let version = '';

        git.stdout.on('data', (data) => {
          version += data.toString();
        });

        git.on('close', (code) => {
          resolve({
            available: code === 0,
            version: version.trim()
          });
        });

        git.on('error', () => {
          resolve({ available: false, version: null });
        });
      });

      return res.status(200).json({
        success: true,
        service: 'Git Service',
        git: gitCheck,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Health check failed',
        message: error.message
      });
    }
  }
}

// Export singleton instance
module.exports = new GitController();

// Made with Bob
