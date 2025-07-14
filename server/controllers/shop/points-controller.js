const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

// Redeem an item via points
const redeemItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) {
      return res.status(404).json({ success: false, message: "User or product not found" });
    }
    if (product.status !== 'available' || !product.approval) {
      return res.status(400).json({ success: false, message: "Product not available for redemption" });
    }
    if (user.points < product.pointsValue) {
      return res.status(400).json({ success: false, message: "Insufficient points" });
    }
    user.points -= product.pointsValue;
    await user.save();
    product.status = 'redeemed';
    await product.save();

    // Create an order for the points redemption
    const order = new Order({
      userId: user._id.toString(),
      cartItems: [{
        productId: product._id.toString(),
        title: product.title,
        image: product.image,
        price: 0,
        quantity: 1,
      }],
      addressInfo: {}, // No address for points redemption
      orderStatus: "confirmed",
      paymentMethod: "points",
      paymentStatus: "completed",
      totalAmount: 0,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    });
    await order.save();
    console.log("Order created for points redemption:", order);

    res.status(200).json({ success: true, message: "Item redeemed successfully", userPoints: user.points });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error redeeming item" });
  }
};

// Get user points balance
const getUserPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching points for userId:', userId); // <-- Add this
    const user = await User.findById(userId);
    console.log('User found:', user); // <-- And this
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, points: user.points });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error fetching user points" });
  }
};

module.exports = {
  redeemItem,
  getUserPoints,
}; 