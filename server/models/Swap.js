const mongoose = require("mongoose");

const SwapSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    offeredItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // optional, for direct swap
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], default: 'pending' },
    type: { type: String, enum: ['swap', 'points'], default: 'swap' }, // swap or points redemption
    pointsOffered: { type: Number, default: 0 }, // for points-based redemption
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Swap", SwapSchema); 