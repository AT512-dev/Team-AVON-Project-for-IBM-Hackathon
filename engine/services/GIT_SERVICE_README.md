# Git Service - Secure Repository Fetching

## Overview

The Git Service provides secure repository fetching capabilities for CodeGuard AI. It implements multiple layers of security to prevent common vulnerabilities like command injection, path traversal, and malicious URL exploitation.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Request                         │
│              POST /api/v1/fetch-repo                         │
│              { "repoUrl": "https://..." }                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                Validation Middleware                         │
│              validateRepoRequest.js                          │
│         • Basic URL format validation                        │
│         • Request structure validation                       │
│         • Dangerous character detection                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Git Controller                              │
│               gitController.js                               │
│         • Request handling & error management                │
│         • Response formatting                                │
│         • Logging & monitoring                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Git Service                                │
│                gitService.js                                 │
│         • Advanced URL validation                            │
│         • Secure git clone execution                         │
│         • Workspace management                               │
│         • Path traversal prevention                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 File System                                  │
│            /tmp/codeguard-repos/                             │
│         • Isolated workspace directories                     │
│         • UUID-based folder names                            │
│         • Automatic cleanup capabilities                     │
└─────────────────────────────────────────────────────────────┘
```

## Security Features

### 1. Command Injection Prevention

**Problem**: Malicious users could inject shell commands via repository URLs.

**Solution**: 
- Uses `spawn()` with argument arrays instead of `exec()` with string concatenation
- No shell interpretation of the URL parameter
- Validates URLs against strict patterns before processing

**Example Attack Prevented**:
```javascript
// DANGEROUS (what we DON'T do):
exec(`git clone ${userUrl} ${targetPath}`); // Vulnerable to injection

// SECURE (what we DO):
spawn('git', ['clone', '--depth', '1', userUrl, targetPath]); // Safe
```

### 2. URL Validation

**Multi-layer validation**:
1. **Format validation**: Must match known Git URL patterns
2. **Character filtering**: Rejects dangerous characters (`; & | \` $ ( ) { } [ ] < >`)
3. **Protocol restriction**: Only HTTPS and SSH protocols allowed
4. **Domain whitelist**: Supports GitHub, GitLab, Bitbucket, and generic Git servers

**Valid URL Examples**:
```
✅ https://github.com/user/repo.git
✅ https://gitlab.com/group/project.git
✅ git@github.com:user/repo.git
❌ https://github.com/user/repo.git; rm -rf /
❌ ftp://malicious.com/repo.git
❌ https://github.com/../../../etc/passwd
```

### 3. Path Traversal Prevention

**Problem**: Attackers could try to access files outside the intended directory.

**Solution**:
- All workspaces created in isolated base directory (`/tmp/codeguard-repos/`)
- UUID-based workspace names prevent predictable paths
- Path validation ensures cleanup operations stay within bounds
- Normalized path checking prevents `../` attacks

### 4. Resource Management

**Timeout Protection**:
- 2-minute timeout for clone operations
- Prevents hanging processes from consuming resources

**Shallow Cloning**:
- Uses `--depth 1` for speed and bandwidth optimization
- Only clones the latest commit, not full history
- Includes `--single-branch` and `--no-tags` for efficiency

**Automatic Cleanup**:
- Workspace cleanup on operation failure
- Scheduled cleanup of old workspaces
- Graceful error handling for cleanup failures

## API Endpoints

### 1. Fetch Repository
```http
POST /api/v1/fetch-repo
Content-Type: application/json

{
  "repoUrl": "https://github.com/user/repo.git"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "workspacePath": "/tmp/codeguard-repos/550e8400-e29b-41d4-a716-446655440000",
  "repoUrl": "https://github.com/user/repo.git",
  "fileCount": 42,
  "message": "Repository fetched and verified successfully",
  "timestamp": "2026-05-02T16:00:00.000Z"
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "error": "Invalid repository URL",
  "message": "The provided URL is not a valid or safe Git repository URL",
  "details": "Invalid or potentially unsafe repository URL"
}
```

### 2. Cleanup Workspace
```http
DELETE /api/v1/workspace/{workspaceId}
```

### 3. Cleanup Old Workspaces
```http
POST /api/v1/cleanup-old-workspaces
Content-Type: application/json

{
  "hoursOld": 24
}
```

### 4. Git Health Check
```http
GET /api/v1/git/health
```

## Usage Examples

### Basic Repository Fetch
```javascript
const response = await fetch('/api/v1/fetch-repo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repoUrl: 'https://github.com/user/repo.git'
  })
});

const result = await response.json();
if (result.success) {
  console.log(`Repository cloned to: ${result.workspacePath}`);
  console.log(`Files found: ${result.fileCount}`);
}
```

### Error Handling
```javascript
try {
  const result = await gitService.fetchRepository(repoUrl);
  // Process successful result
} catch (error) {
  if (error.message.includes('Invalid or potentially unsafe')) {
    // Handle invalid URL
  } else if (error.message.includes('timed out')) {
    // Handle timeout
  } else {
    // Handle other errors
  }
}
```

## Configuration

### Environment Variables
```bash
# Optional: Custom frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Optional: Custom port (default: 3001)
PORT=3001

# Optional: Node environment
NODE_ENV=production
```

### System Requirements
- Node.js ≥ 18.0.0 (for crypto.randomUUID support)
- Git installed and available in PATH
- Sufficient disk space in temp directory
- Network access to target repositories

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run only Git service tests
npm test -- --testPathPattern=gitService

# Run tests with coverage
npm test -- --coverage
```

### Security Test Cases
The test suite includes comprehensive security tests:
- Command injection prevention
- Path traversal protection
- URL validation edge cases
- Malicious input handling
- Resource cleanup verification

## Monitoring & Logging

### Log Levels
- **INFO**: Successful operations, workspace creation/cleanup
- **ERROR**: Failed operations, security violations, system errors
- **DEBUG**: Detailed operation flow (development only)

### Key Metrics to Monitor
- Repository fetch success/failure rates
- Average clone times
- Workspace disk usage
- Failed validation attempts (potential attacks)
- Cleanup operation effectiveness

## Production Deployment

### Security Checklist
- [ ] Ensure Git is installed and updated
- [ ] Configure proper file system permissions
- [ ] Set up log monitoring for security events
- [ ] Implement rate limiting on endpoints
- [ ] Configure firewall rules for outbound Git access
- [ ] Set up automated workspace cleanup scheduling
- [ ] Monitor disk space usage
- [ ] Test with various repository sizes

### Performance Optimization
- Use SSD storage for temporary directories
- Configure appropriate timeout values
- Implement caching for frequently accessed repositories
- Monitor and tune garbage collection for Node.js
- Consider implementing request queuing for high load

## Troubleshooting

### Common Issues

**Git not found**:
```
Error: Git process error: spawn git ENOENT
```
Solution: Install Git and ensure it's in the system PATH.

**Permission denied**:
```
Error: EACCES: permission denied, mkdir '/tmp/codeguard-repos'
```
Solution: Ensure Node.js process has write permissions to temp directory.

**Network timeout**:
```
Error: Git clone operation timed out after 2 minutes
```
Solution: Check network connectivity, try smaller repository, or increase timeout.

**Disk space**:
```
Error: ENOSPC: no space left on device
```
Solution: Clean up old workspaces, increase disk space, or implement stricter cleanup policies.

## Security Considerations

### Threat Model
1. **Malicious URLs**: Prevented by strict validation
2. **Command Injection**: Prevented by using spawn() with arrays
3. **Path Traversal**: Prevented by isolated workspaces and path validation
4. **Resource Exhaustion**: Mitigated by timeouts and cleanup
5. **Information Disclosure**: Prevented by error message sanitization

### Security Best Practices
- Regularly update Git and Node.js
- Monitor for unusual repository access patterns
- Implement rate limiting to prevent abuse
- Use HTTPS for all repository URLs when possible
- Regularly audit and test security measures
- Keep dependencies updated
- Implement proper logging and monitoring

## Contributing

When modifying the Git service:
1. Maintain all existing security measures
2. Add comprehensive tests for new features
3. Update documentation
4. Test with various repository types and sizes
5. Verify security implications of changes
6. Follow the existing code style and patterns