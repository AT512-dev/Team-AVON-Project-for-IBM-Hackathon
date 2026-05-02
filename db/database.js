function findUserById(id, callback) {
  const query = "SELECT * FROM users WHERE id = " + id;
  connection.query(query, (err, rows) => { callback(rows); });
}

module.exports = { findUserById };

// Made with Bob
