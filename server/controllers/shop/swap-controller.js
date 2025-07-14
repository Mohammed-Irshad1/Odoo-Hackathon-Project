const Swap = require("../../models/Swap");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Order = require("../../models/Order");

// Create a swap request (swap or points-based)
const createSwap = async (req, res) => {
  try {
    console.log('Incoming swap request:', req.body);
    const { requester, responder, requestedItem, offeredItem, type, pointsOffered } = req.body;
    const swap = new Swap({
      requester,
      responder,
      requestedItem,
      offeredItem,
      type,
      pointsOffered: type === 'points' ? pointsOffered : 0
    });
    await swap.save();
    res.status(201).json({ success: true, data: swap });
  } catch (e) {
    console.log('Swap creation error:', e);
    res.status(500).json({ success: false, message: "Error creating swap" });
  }
};

// List swaps for a user (as requester or responder)
const listUserSwaps = async (req, res) => {
  try {
    const { userId } = req.params;
    const swaps = await Swap.find({ $or: [ { requester: userId }, { responder: userId } ] })
      .populate('requester responder requestedItem offeredItem');
    res.status(200).json({ success: true, data: swaps });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error fetching swaps" });
  }
};

// List all swaps (admin)
const listAllSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({})
      .populate('requester responder requestedItem offeredItem');
    res.status(200).json({ success: true, data: swaps });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error fetching swaps" });
  }
};

// Update swap status (accept, reject, complete, cancel)
const updateSwapStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const swap = await Swap.findByIdAndUpdate(id, { status }, { new: true }).populate('requestedItem offeredItem requester responder');
    if (!swap) {
      return res.status(404).json({ success: false, message: "Swap not found" });
    }
    // If accepted, create orders for both users and update product status
    if (status === 'accepted') {
      // Order for responder (receives offeredItem)
      if (swap.offeredItem) {
        await Order.create({
          userId: swap.responder._id.toString(),
          cartItems: [{
            productId: swap.offeredItem._id.toString(),
            title: swap.offeredItem.title,
            image: swap.offeredItem.image,
            price: swap.offeredItem.price,
            quantity: 1,
          }],
          orderStatus: 'swapped',
          paymentMethod: 'swap',
          paymentStatus: 'completed',
          totalAmount: 0,
          orderDate: new Date(),
          orderType: 'swap',
        });
        await Product.findByIdAndUpdate(swap.offeredItem._id, { status: 'swapped' });
      }
      // Order for requester (receives requestedItem)
      if (swap.requestedItem) {
        await Order.create({
          userId: swap.requester._id.toString(),
          cartItems: [{
            productId: swap.requestedItem._id.toString(),
            title: swap.requestedItem.title,
            image: swap.requestedItem.image,
            price: swap.requestedItem.price,
            quantity: 1,
          }],
          orderStatus: 'swapped',
          paymentMethod: 'swap',
          paymentStatus: 'completed',
          totalAmount: 0,
          orderDate: new Date(),
          orderType: 'swap',
        });
        await Product.findByIdAndUpdate(swap.requestedItem._id, { status: 'swapped' });
      }
    }
    // If completed, update product status
    if (status === 'completed') {
      await Product.findByIdAndUpdate(swap.requestedItem, { status: 'swapped' });
      if (swap.offeredItem) {
        await Product.findByIdAndUpdate(swap.offeredItem, { status: 'swapped' });
      }
    }
    res.status(200).json({ success: true, data: swap });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error updating swap" });
  }
};

module.exports = {
  createSwap,
  listUserSwaps,
  listAllSwaps,
  updateSwapStatus,
}; 