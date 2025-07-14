const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

async function assignRandomPointsValue() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce");
  const products = await Product.find();
  for (const product of products) {
    // Assign a random pointsValue between 10 and 100
    product.pointsValue = Math.floor(Math.random() * 91) + 10;
    await product.save();
  }
  console.log("Random pointsValue assigned to all products.");
  process.exit(0);
}

assignRandomPointsValue().catch(err => {
  console.error("Error:", err);
  process.exit(1);
}); 