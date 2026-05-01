const mockRepo = [
  {
    file: "auth.js",
    content: `
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function login(req, res) {
  const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";
  
  const password = "admin123";
  
  if (user.password === req.body.password) {
    return res.json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id });
  
  eval(req.body.customCode);
  
  res.json({ token });
}
    `
  },
  {
    file: "config.js",
    content: `
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: "*" }));

const API_KEY = "sk_live_51HxYz2KuD4aW8vH9";
const DB_PASSWORD = "mySecretPass123";

app.set('trust proxy', true);

const options = {
  strictSSL: false,
  rejectUnauthorized: false
};
    `
  },
  {
    file: "api.js",
    content: `
const axios = require('axios');
const crypto = require('crypto');

app.post('/fetch-url', (req, res) => {
  fetch(req.body.url)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(() => {});
});

app.get('/user/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user));
});

function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

const sessionToken = Math.random().toString(36);
    `
  },
  {
    file: "routes.js",
    content: `
app.get('/admin', (req, res) => {
  res.send('Admin panel');
});

app.post('/execute', (req, res) => {
  const command = "ls -la " + req.body.path;
  exec(command, (error, stdout) => {
    res.send(stdout);
  });
});

app.get('/file', (req, res) => {
  res.sendFile(req.query.path);
});

app.use(session({
  secret: 'keyboard cat',
  secure: false,
  httpOnly: false
}));
    `
  },
  {
    file: "database.js",
    content: `
const mongoose = require('mongoose');

function searchUsers(req, res) {
  User.find({ $where: req.body.condition })
    .then(users => res.json(users))
    .catch(err => res.send(err));
}

function updateUser(req, res) {
  const updateQuery = "UPDATE users SET name = '" + req.body.name + "' WHERE id = " + req.params.id;
  db.execute(updateQuery);
}

setTimeout(req.body.delay);

const result = JSON.parse(req.body.data);
    `
  },
  {
    file: "legacy.js",
    content: `
const request = require('request');
const moment = require('moment');
const lodash = require('lodash');

function processData(input) {
  return new Function('return ' + input)();
}

setInterval("console.log('tick')", 1000);

vm.runInNewContext(userCode);
    `
  }
];

module.exports = { mockRepo };

