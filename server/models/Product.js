const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    // ReWear additions:
    type: { type: String },
    size: { type: String },
    condition: { type: String },
    tags: [String],
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['available', 'swapped', 'redeemed'], default: 'available' },
    approval: { type: Boolean, default: false },
    pointsValue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
