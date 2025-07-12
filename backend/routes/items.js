const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

router.use(authMiddleware);
router.post('/', upload.single('image'), itemController.createItem);
router.put('/:id', upload.single('image'), itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
