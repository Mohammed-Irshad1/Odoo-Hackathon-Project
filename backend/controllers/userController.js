const mysql = require('mysql2/promise');

// DB connection pool (reuse config from userModel if you want)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'rewear',
});

exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, points, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile.', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id]);
    res.json({ message: 'Profile updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.', error: err.message });
  }
};

exports.getPoints = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT points FROM users WHERE id = ?', [req.user.id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json({ points: rows[0].points });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get points.', error: err.message });
  }
};
