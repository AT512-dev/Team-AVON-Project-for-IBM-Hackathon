const db = require('../db/database');

function getUser(req, res) {
  const userId = req.query.id; 
  db.findUserById(userId, (result) => { res.send(result); });
}

module.exports = { getUser };

// Made with Bob
