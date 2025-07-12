const { createItem, getAllItems, getAllItemsForAdmin, getItemById, updateItem, deleteItem, createSwapRequest, getSwapRequestsForUser, updateSwapRequestStatus, getSwapRequestById, createNotification } = require('../models/itemModel');
const { incrementUserPoints, decrementUserPoints } = require('../models/userModel');
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
    await incrementUserPoints(req.user.id, 10); // Award 10 points for listing
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item.', error: err.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const filters = {
      search: req.query.search || '',
      category: req.query.category || '',
      type: req.query.type || '',
      size: req.query.size || '',
      condition: req.query.condition || '',
    };
    const items = await getAllItems(filters);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get items.', error: err.message });
  }
};

exports.getAllItemsForAdmin = async (req, res) => {
  try {
    const items = await getAllItemsForAdmin();
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
    // Store reason if provided
    if (typeof updates.reason !== 'undefined') {
      updates.reason = updates.reason;
    }
    await updateItem(req.params.id, updates);
    // Deduct points if item is redeemed
    if (updates.status === 'redeemed') {
      const item = await getItemById(req.params.id);
      await decrementUserPoints(item.user_id, 10); // Deduct 10 points for redemption
      // Notify user
      await createNotification({ userId: item.user_id, type: 'item_redeemed', content: `Your item #${item.id} was redeemed.` });
    }
    res.json({ message: 'Item updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item.', error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    // Optionally store reason for deletion (if provided)
    const reason = req.body?.reason || req.query?.reason;
    if (reason) {
      await updateItem(req.params.id, { reason });
    }
    await deleteItem(req.params.id);
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item.', error: err.message });
  }
};

exports.createSwapRequest = async (req, res) => {
  try {
    const { itemId, ownerId } = req.body;
    const requesterId = req.user.id;
    const swapRequest = await createSwapRequest({ itemId, requesterId, ownerId });
    // Notify owner
    await createNotification({ userId: ownerId, type: 'swap_request', content: `New swap request for item #${itemId}` });
    res.status(201).json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create swap request.', error: err.message });
  }
};

exports.getSwapRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await getSwapRequestsForUser(userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get swap requests.', error: err.message });
  }
};

exports.updateSwapRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    await updateSwapRequestStatus(requestId, status);
    if (status === 'approved') {
      const swapRequest = await getSwapRequestById(requestId);
      await updateItem(swapRequest.item_id, { status: 'swap requested' });
      await incrementUserPoints(swapRequest.requester_id, 20); // Award 20 points for successful swap
      // Notify requester
      await createNotification({ userId: swapRequest.requester_id, type: 'swap_approved', content: `Your swap request for item #${swapRequest.item_id} was approved.` });
    } else if (status === 'declined') {
      const swapRequest = await getSwapRequestById(requestId);
      // Notify requester
      await createNotification({ userId: swapRequest.requester_id, type: 'swap_declined', content: `Your swap request for item #${swapRequest.item_id} was declined.` });
    }
    res.json({ message: 'Swap request updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update swap request.', error: err.message });
  }
};
