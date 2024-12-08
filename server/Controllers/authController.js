const connection = require("../db");
const jwt = require('jsonwebtoken');
const secretKey = '&*)043783&';
const log_in = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    // Query to find the user
    connection.query('SELECT user_id, user_name, email, password FROM user WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).send('Database error');
        }
       
        let user = result[0];
      
        // Check if user exists and passwords match
        if (!user || user.password !== password) {
            return res.status(401).send('Email or password is incorrect');
        }
        // Generate a token and send it back
        delete user.password;
        const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ token});
    });
}

const sign_in = (req, res) => {
  const { email, password, user_name } = req.body;

  // Check if email, password, and username are provided
  if (!email || !password || !user_name) {
    return res.status(400).send('Email, password, and username are required');
  }

  // Check if the user already exists
  connection.query(
    'SELECT email, user_name FROM user WHERE email = ? OR user_name = ?',
    [email, user_name],
    (err, result) => {
      if (err) {
        return res.status(500).send('Database error');
      }

      // If user exists, send an error response
      if (result.length > 0) {
        return res.status(401).send('User name or email already exists');
      }

      // Insert the new user into the database
      connection.query(
        'INSERT INTO user (user_name, email, password) VALUES (?, ?, ?)',
        [user_name, email, password],
        (err, result) => {
          if (err) {
            return res.status(500).send('Database error during sign up');
          }

          // Create a payload for the JWT token
          const payload = {
            user_id: result.insertId,
            user_name: user_name,
            email: email,
          };

          // Generate the JWT token
          const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
          return res.status(200).json({ token });
        }
      );
    }
  );
};

module.exports = {log_in, sign_in};