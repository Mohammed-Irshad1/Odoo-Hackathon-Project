const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('../models/itemModel');
const path = require('path');

exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!title || !image) {
      return res.status(400).json({ message: 'Title and image are required.' });
    }
    const item = {
      user_id: req.user.id,
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      image,
      status: 'pending',
    };
    const newItem = await createItem(item);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item.', error: err.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get items.', error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get item.', error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.image = req.file.filename;
    }
    await updateItem(req.params.id, updates);
    res.json({ message: 'Item updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item.', error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await deleteItem(req.params.id);
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item.', error: err.message });
  }
};
