'use strict';

const { spawn } = require('child_process');
const { randomUUID } = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

/**
 * GitService - Secure repository fetching service
 * 
 * Security Features:
 * - No shell injection: Uses spawn with argument arrays
 * - URL validation: Validates Git URLs before processing
 * - Path traversal protection: Uses isolated temporary directories
 * - Shallow cloning: Uses --depth 1 for speed optimization
 */
class GitService {
  constructor() {
    // Base directory for all temporary repositories
    this.baseRepoDir = path.join(os.tmpdir(), 'codeguard-repos');
    this.initializeBaseDirectory();
  }

  /**
   * Initialize base directory for repositories
   */
  async initializeBaseDirectory() {
    try {
      await fs.mkdir(this.baseRepoDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create base repository directory:', error);
    }
  }

  /**
   * Validate Git repository URL
   * 
   * Security: Prevents command injection and ensures valid Git URLs
   * 
   * @param {string} repoUrl - Repository URL to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  validateGitUrl(repoUrl) {
    if (!repoUrl || typeof repoUrl !== 'string') {
      return false;
    }

    // Trim whitespace
    const url = repoUrl.trim();

    // Check for dangerous characters that could be used for injection
    const dangerousChars = /[;&|`$(){}[\]<>]/;
    if (dangerousChars.test(url)) {
      return false;
    }

    // Check for path traversal attempts
    if (url.includes('..')) {
      return false;
    }

    // Valid Git URL patterns
    const validPatterns = [
      // HTTPS URLs
      /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/i,
      /^https:\/\/gitlab\.com\/[\w\-\.\/]+(?:\.git)?$/i,
      /^https:\/\/bitbucket\.org\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/i,
      // Generic HTTPS Git URLs
      /^https:\/\/[\w\-\.]+\/[\w\-\.\/]+\.git$/i,
      // SSH URLs (for completeness, though HTTPS is preferred)
      /^git@github\.com:[\w\-\.]+\/[\w\-\.]+\.git$/i,
      /^git@gitlab\.com:[\w\-\.\/]+\.git$/i,
      /^git@bitbucket\.org:[\w\-\.]+\/[\w\-\.]+\.git$/i
    ];

    return validPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Sanitize repository URL
   * 
   * @param {string} repoUrl - Repository URL
   * @returns {string} - Sanitized URL
   */
  sanitizeUrl(repoUrl) {
    return repoUrl.trim();
  }

  /**
   * Generate unique workspace directory
   * 
   * Security: Creates isolated directory with UUID to prevent path traversal
   * 
   * @returns {Object} - Object containing workspaceId and workspacePath
   */
  generateWorkspace() {
    const workspaceId = randomUUID();
    const workspacePath = path.join(this.baseRepoDir, workspaceId);
    
    return {
      workspaceId,
      workspacePath
    };
  }

  /**
   * Clone repository using secure spawn method
   * 
   * Security: Uses spawn with argument array to prevent shell injection
   * 
   * @param {string} repoUrl - Repository URL
   * @param {string} targetPath - Target directory path
   * @returns {Promise<Object>} - Clone result with success status and details
   */
  async cloneRepository(repoUrl, targetPath) {
    return new Promise((resolve, reject) => {
      // Security: Use spawn with argument array (NOT exec with string concatenation)
      const gitProcess = spawn('git', [
        'clone',
        '--depth', '1',           // Shallow clone for speed
        '--single-branch',        // Only clone default branch
        '--no-tags',              // Skip tags for speed
        repoUrl,
        targetPath
      ], {
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120000,          // 2 minute timeout
        windowsHide: true         // Hide window on Windows
      });

      let stdout = '';
      let stderr = '';

      gitProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      gitProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      gitProcess.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            message: 'Repository cloned successfully',
            stdout,
            stderr
          });
        } else {
          reject(new Error(`Git clone failed with code ${code}: ${stderr}`));
        }
      });

      gitProcess.on('error', (error) => {
        reject(new Error(`Git process error: ${error.message}`));
      });

      // Handle timeout
      setTimeout(() => {
        if (!gitProcess.killed) {
          gitProcess.kill();
          reject(new Error('Git clone operation timed out after 2 minutes'));
        }
      }, 120000);
    });
  }

  /**
   * Verify cloned repository structure
   * 
   * @param {string} workspacePath - Path to workspace
   * @returns {Promise<Object>} - Repository information
   */
  async verifyRepository(workspacePath) {
    try {
      const stats = await fs.stat(workspacePath);
      if (!stats.isDirectory()) {
        throw new Error('Workspace path is not a directory');
      }

      // Check if .git directory exists
      const gitDir = path.join(workspacePath, '.git');
      const gitStats = await fs.stat(gitDir);
      
      if (!gitStats.isDirectory()) {
        throw new Error('Not a valid Git repository');
      }

      // Count files in repository (excluding .git)
      const files = await this.countFiles(workspacePath);

      return {
        valid: true,
        fileCount: files,
        path: workspacePath
      };
    } catch (error) {
      throw new Error(`Repository verification failed: ${error.message}`);
    }
  }

  /**
   * Count files in directory (excluding .git)
   * 
   * @param {string} dirPath - Directory path
   * @returns {Promise<number>} - File count
   */
  async countFiles(dirPath) {
    let count = 0;
    
    async function traverse(currentPath) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        // Skip .git directory
        if (entry.name === '.git') continue;
        
        const fullPath = path.join(currentPath, entry.name);
        
        if (entry.isDirectory()) {
          await traverse(fullPath);
        } else {
          count++;
        }
      }
    }
    
    await traverse(dirPath);
    return count;
  }

  /**
   * Main method: Fetch repository securely
   * 
   * @param {string} repoUrl - Repository URL
   * @returns {Promise<Object>} - Fetch result with workspace details
   */
  async fetchRepository(repoUrl) {
    // Step 1: Validate URL
    if (!this.validateGitUrl(repoUrl)) {
      throw new Error('Invalid or potentially unsafe repository URL');
    }

    // Step 2: Sanitize URL
    const sanitizedUrl = this.sanitizeUrl(repoUrl);

    // Step 3: Generate unique workspace
    const { workspaceId, workspacePath } = this.generateWorkspace();

    try {
      // Step 4: Clone repository
      const cloneResult = await this.cloneRepository(sanitizedUrl, workspacePath);

      // Step 5: Verify repository
      const verifyResult = await this.verifyRepository(workspacePath);

      // Step 6: Return success result
      return {
        success: true,
        workspaceId,
        workspacePath,
        repoUrl: sanitizedUrl,
        fileCount: verifyResult.fileCount,
        message: 'Repository fetched and verified successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Cleanup on failure
      await this.cleanupWorkspace(workspacePath);
      throw error;
    }
  }

  /**
   * Cleanup workspace directory
   * 
   * @param {string} workspacePath - Path to workspace
   * @returns {Promise<void>}
   */
  async cleanupWorkspace(workspacePath) {
    try {
      // Security: Ensure path is within our base directory
      const normalizedPath = path.normalize(workspacePath);
      const normalizedBase = path.normalize(this.baseRepoDir);
      
      if (!normalizedPath.startsWith(normalizedBase)) {
        throw new Error('Invalid workspace path for cleanup');
      }

      await fs.rm(workspacePath, { recursive: true, force: true });
    } catch (error) {
      console.error('Cleanup failed:', error);
      // Don't throw - cleanup is best effort
    }
  }

  /**
   * Cleanup old workspaces (older than specified hours)
   * 
   * @param {number} hoursOld - Age threshold in hours
   * @returns {Promise<number>} - Number of workspaces cleaned
   */
  async cleanupOldWorkspaces(hoursOld = 24) {
    try {
      const entries = await fs.readdir(this.baseRepoDir, { withFileTypes: true });
      const now = Date.now();
      const threshold = hoursOld * 60 * 60 * 1000;
      let cleaned = 0;

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const dirPath = path.join(this.baseRepoDir, entry.name);
          const stats = await fs.stat(dirPath);
          const age = now - stats.mtimeMs;

          if (age > threshold) {
            await this.cleanupWorkspace(dirPath);
            cleaned++;
          }
        }
      }

      return cleaned;
    } catch (error) {
      console.error('Old workspace cleanup failed:', error);
      return 0;
    }
  }
}

// Export singleton instance
module.exports = new GitService();

// Made with Bob
