const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'rewear',
});

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function createUser({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return { id: result.insertId, name, email };
}

async function getAllUsers() {
  const [rows] = await pool.query('SELECT id, name, email, points, created_at FROM users');
  return rows;
}

async function incrementUserPoints(userId, amount) {
  await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [amount, userId]);
}

async function decrementUserPoints(userId, amount) {
  await pool.query('UPDATE users SET points = GREATEST(points - ?, 0) WHERE id = ?', [amount, userId]);
}

async function getUserPoints(userId) {
  const [rows] = await pool.query('SELECT points FROM users WHERE id = ?', [userId]);
  return rows[0]?.points || 0;
}

module.exports = { findUserByEmail, createUser, getAllUsers, incrementUserPoints, decrementUserPoints, getUserPoints };
