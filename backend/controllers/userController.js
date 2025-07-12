const mysql = require('mysql2/promise');
const { getAllUsers: getAllUsersModel } = require('../models/userModel');
const { addFavorite, removeFavorite, getFavoritesByUser, sendMessage, getConversation, getUserConversations, markMessagesRead, createNotification, getNotificationsForUser, markNotificationRead } = require('../models/itemModel');

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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersModel();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users.', error: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    await addFavorite(req.user.id, req.body.itemId);
    res.json({ message: 'Item added to favorites.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add favorite.', error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    await removeFavorite(req.user.id, req.params.itemId);
    res.json({ message: 'Item removed from favorites.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite.', error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const items = await getFavoritesByUser(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get favorites.', error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, itemId, content } = req.body;
    await sendMessage({ senderId: req.user.id, receiverId, itemId, content });
    res.json({ message: 'Message sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message.', error: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId, itemId } = req.query;
    const messages = await getConversation(req.user.id, userId, itemId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get conversation.', error: err.message });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const messages = await getUserConversations(req.user.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get conversations.', error: err.message });
  }
};

exports.markMessagesRead = async (req, res) => {
  try {
    const { senderId, itemId } = req.body;
    await markMessagesRead(senderId, req.user.id, itemId);
    res.json({ message: 'Messages marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark messages as read.', error: err.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, type, content } = req.body;
    await createNotification({ userId, type, content });
    res.json({ message: 'Notification created.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create notification.', error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsForUser(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get notifications.', error: err.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await markNotificationRead(req.params.id);
    res.json({ message: 'Notification marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notification as read.', error: err.message });
  }
};
