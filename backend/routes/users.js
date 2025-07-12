const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.get('/me/points', userController.getPoints);
router.get('/all', userController.getAllUsers);
router.post('/favorites', userController.addFavorite);
router.delete('/favorites/:itemId', userController.removeFavorite);
router.get('/favorites', userController.getFavorites);
router.post('/messages', userController.sendMessage);
router.get('/messages/conversation', userController.getConversation);
router.get('/messages', userController.getUserConversations);
router.put('/messages/read', userController.markMessagesRead);
router.post('/notifications', userController.createNotification);
router.get('/notifications', userController.getNotifications);
router.put('/notifications/:id/read', userController.markNotificationRead);

module.exports = router;
