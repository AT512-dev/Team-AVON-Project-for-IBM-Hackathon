// User service with cross-file vulnerabilities
const crypto = require('crypto');
const db = require('./database');

class UserService {
  // VULNERABILITY: Weak password hashing
  static hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  // VULNERABILITY: No input validation
  static async createUser(userData) {
    const hashedPassword = this.hashPassword(userData.password);
    
    // Data flows to database without sanitization
    return db.insert('users', {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user'
    });
  }

  // VULNERABILITY: Privilege escalation risk
  static async updateUserRole(userId, newRole) {
    // No authorization check - any user can change roles
    return db.update('users', { role: newRole }, { id: userId });
  }

  // VULNERABILITY: Information disclosure
  static async getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    return db.query(query);
  }
}

module.exports = UserService;

// Made with Bob
