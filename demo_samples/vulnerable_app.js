// Sample vulnerable Node.js application for AVON demonstration
const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

// VULNERABILITY 1: Hardcoded credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin123',  // Hardcoded password
  database: 'userdb'
});

// VULNERABILITY 2: SQL Injection
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;  // Direct string concatenation
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// VULNERABILITY 3: Command Injection
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

// VULNERABILITY 4: Insecure Direct Object Reference
app.get('/document/:docId', (req, res) => {
  const docId = req.params.docId;
  // No authorization check
  const filePath = `/documents/${docId}.pdf`;
  res.sendFile(filePath);
});

// VULNERABILITY 5: Missing authentication
app.delete('/user/:id', (req, res) => {
  const userId = req.params.id;
  db.query(`DELETE FROM users WHERE id = ?`, [userId], (err) => {
    if (err) throw err;
    res.send('User deleted');
  });
});

// VULNERABILITY 6: Sensitive data exposure
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    // Returns all user data including passwords
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Made with Bob
