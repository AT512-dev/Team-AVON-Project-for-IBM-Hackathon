# 🔧 AVON Remediation Guide

**Audit ID:** audit_20260501_201630_abc123  
**Generated:** May 1, 2026 20:16:30 UTC  
**Repository:** vulnerable-demo-app

---

## 📊 Remediation Summary

| Priority | Count | Estimated Effort |
|----------|-------|------------------|
| IMMEDIATE | 4 | 2-4 hours |
| HIGH | 5 | 4-8 hours |
| MEDIUM | 2 | 2-4 hours |
| LOW | 1 | 1 hour |

**Total Estimated Effort:** 9-17 hours

---

## 🚨 IMMEDIATE Priority Fixes

### 1. SQL Injection in User Query (VULN-001)

**File:** `vulnerable_app.js:18`  
**Severity:** CRITICAL (CVSS 9.8)  
**Effort:** LOW (30 minutes)

#### Current Code:
```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;  // VULNERABLE
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
```

#### Fixed Code:
```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // Use parameterized query to prevent SQL injection
  const query = 'SELECT * FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(results[0]);
  });
});
```

#### Testing:
```bash
# Test with normal input
curl http://localhost:3000/user/1

# Test with SQL injection attempt (should be safe now)
curl http://localhost:3000/user/1%27%20OR%20%271%27=%271
```

---

### 2. Hardcoded Database Credentials (VULN-002)

**File:** `vulnerable_app.js:11`  
**Severity:** CRITICAL (CVSS 9.1)  
**Effort:** LOW (15 minutes)

#### Current Code:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin123',  // HARDCODED - VULNERABLE
  database: 'userdb'
});
```

#### Fixed Code:
```javascript
// Load environment variables
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

#### Create `.env` file:
```env
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=your_secure_password_here
DB_NAME=userdb
```

#### Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

### 3. Command Injection Vulnerability (VULN-003)

**File:** `vulnerable_app.js:29`  
**Severity:** CRITICAL (CVSS 9.8)  
**Effort:** MEDIUM (1 hour)

#### Current Code:
```javascript
app.post('/backup', (req, res) => {
  const filename = req.body.filename;
  const exec = require('child_process').exec;
  exec(`tar -czf /backups/${filename}.tar.gz /data`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send('Backup failed');
    } else {
      res.send('Backup completed');
    }
  });
});
```

#### Fixed Code:
```javascript
const { spawn } = require('child_process');
const path = require('path');

app.post('/backup', (req, res) => {
  const filename = req.body.filename;
  
  // Validate filename - only allow alphanumeric and hyphens
  const filenameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!filenameRegex.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename format' });
  }
  
  // Use spawn with array arguments (safer than exec)
  const backupPath = path.join('/backups', `${filename}.tar.gz`);
  const tar = spawn('tar', ['-czf', backupPath, '/data']);
  
  tar.on('error', (error) => {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Backup failed' });
  });
  
  tar.on('close', (code) => {
    if (code === 0) {
      res.json({ message: 'Backup completed', filename: `${filename}.tar.gz` });
    } else {
      res.status(500).json({ error: 'Backup failed with code ' + code });
    }
  });
});
```

---

### 4. Privilege Escalation Risk (VULN-009)

**File:** `user_service.js:23`  
**Severity:** CRITICAL (CVSS 9.1)  
**Effort:** MEDIUM (1-2 hours)

#### Current Code:
```javascript
static async updateUserRole(userId, newRole) {
  // No authorization check - VULNERABLE
  return db.update('users', { role: newRole }, { id: userId });
}
```

#### Fixed Code:
```javascript
static async updateUserRole(requestingUserId, targetUserId, newRole) {
  // Get requesting user's role
  const requestingUser = await db.findOne('users', { id: requestingUserId });
  
  if (!requestingUser) {
    throw new Error('Requesting user not found');
  }
  
  // Only admins can change roles
  if (requestingUser.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can change user roles');
  }
  
  // Validate new role
  const validRoles = ['user', 'moderator', 'admin'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role specified');
  }
  
  // Prevent users from changing their own role
  if (requestingUserId === targetUserId) {
    throw new Error('Cannot change your own role');
  }
  
  // Update the role
  return db.update('users', { role: newRole }, { id: targetUserId });
}
```

#### Add Authentication Middleware:
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
```

---

## ⚠️ HIGH Priority Fixes

### 5. Insecure Direct Object Reference (VULN-004)

**File:** `vulnerable_app.js:38`  
**Severity:** HIGH (CVSS 8.1)  
**Effort:** MEDIUM (1 hour)

#### Fixed Code:
```javascript
const { authenticateToken } = require('./middleware/auth');

app.get('/document/:docId', authenticateToken, async (req, res) => {
  const docId = req.params.docId;
  const userId = req.user.id;
  
  try {
    // Check if user has access to this document
    const document = await db.findOne('documents', { id: docId });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Verify ownership or shared access
    const hasAccess = document.ownerId === userId || 
                     document.sharedWith?.includes(userId);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const filePath = path.join('/documents', `${docId}.pdf`);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Document access error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

### 6. Weak Password Hashing (VULN-007)

**File:** `user_service.js:8`  
**Severity:** HIGH (CVSS 7.4)  
**Effort:** MEDIUM (1 hour)

#### Current Code:
```javascript
static hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}
```

#### Fixed Code:
```javascript
const bcrypt = require('bcrypt');

class UserService {
  static async hashPassword(password) {
    // Use bcrypt with 10 rounds (good balance of security and performance)
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  
  static async createUser(userData) {
    // Validate password strength
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    const hashedPassword = await this.hashPassword(userData.password);
    
    return db.insert('users', {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user'
    });
  }
}
```

#### Install bcrypt:
```bash
npm install bcrypt
```

---

### 7. Missing Authentication on Delete (VULN-005)

**File:** `vulnerable_app.js:43`  
**Severity:** HIGH (CVSS 7.5)  
**Effort:** LOW (30 minutes)

#### Fixed Code:
```javascript
const { authenticateToken, requireAdmin } = require('./middleware/auth');

app.delete('/user/:id', authenticateToken, requireAdmin, async (req, res) => {
  const userId = req.params.id;
  const requestingUserId = req.user.id;
  
  // Prevent self-deletion
  if (userId === requestingUserId) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  
  try {
    const result = await db.query('DELETE FROM users WHERE id = ?', [userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});
```

---

## 📋 MEDIUM Priority Fixes

### 8. Missing Input Validation (VULN-008)

**File:** `user_service.js:12`  
**Severity:** MEDIUM (CVSS 6.5)  
**Effort:** MEDIUM (1-2 hours)

#### Install Validation Library:
```bash
npm install joi
```

#### Fixed Code:
```javascript
const Joi = require('joi');

class UserService {
  static validateUserData(userData) {
    const schema = Joi.object({
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
          'string.pattern.base': 'Password must contain uppercase, lowercase, and number'
        }),
      role: Joi.string()
        .valid('user', 'moderator', 'admin')
        .default('user')
    });
    
    return schema.validate(userData);
  }
  
  static async createUser(userData) {
    // Validate input
    const { error, value } = this.validateUserData(userData);
    
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }
    
    // Check if user already exists
    const existingUser = await db.findOne('users', { 
      $or: [
        { email: value.email },
        { username: value.username }
      ]
    });
    
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
    const hashedPassword = await this.hashPassword(value.password);
    
    return db.insert('users', {
      username: value.username,
      email: value.email,
      password: hashedPassword,
      role: value.role
    });
  }
}
```

---

## 🔍 Testing Your Fixes

### 1. Unit Tests
```javascript
// tests/security.test.js
const request = require('supertest');
const app = require('../app');

describe('Security Tests', () => {
  test('SQL Injection should be prevented', async () => {
    const response = await request(app)
      .get("/user/1' OR '1'='1")
      .expect(400);
  });
  
  test('Unauthorized role change should fail', async () => {
    const response = await request(app)
      .put('/user/123/role')
      .send({ role: 'admin' })
      .expect(401);
  });
  
  test('Weak password should be rejected', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      })
      .expect(400);
  });
});
```

### 2. Integration Tests
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

---

## 📦 Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

Install all:
```bash
npm install
```

---

## ✅ Verification Checklist

- [ ] All CRITICAL vulnerabilities fixed
- [ ] Environment variables configured
- [ ] `.env` added to `.gitignore`
- [ ] Authentication middleware implemented
- [ ] Input validation added
- [ ] Password hashing upgraded to bcrypt
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Code reviewed by security team
- [ ] Documentation updated

---

## 🎯 Next Steps

1. **Deploy fixes to staging environment**
2. **Run penetration testing**
3. **Monitor for any issues**
4. **Deploy to production**
5. **Set up continuous security scanning**

---

## 📞 Support

For questions about these remediations, contact:
- Security Team: security@example.com
- DevOps: devops@example.com

**Generated by AVON v1.0.0**