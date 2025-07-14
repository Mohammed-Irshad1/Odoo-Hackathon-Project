const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const Feature = require("./models/Feature");

// Sample products data
const sampleProducts = [
  {
    title: "Nike Air Max 270",
    description: "Comfortable running shoes with excellent cushioning",
    category: "footwear",
    brand: "nike",
    price: 129.99,
    salePrice: 99.99,
    totalStock: 50,
    averageReview: 4.5,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
  },
  {
    title: "Nike Sportswear Club Fleece Hoodie",
    description: "Soft fleece hoodie for everyday comfort.",
    category: "men",
    brand: "nike",
    price: 59.99,
    salePrice: 49.99,
    totalStock: 40,
    averageReview: 4.7,
    image: "https://images.unsplash.com/photo-1622866654030-fb0958200023?w=700&auto=format&fit=crop&q=60"
  },
  {
    title: "Adidas Ultraboost 21",
    description: "Premium running shoes with responsive cushioning",
    category: "footwear",
    brand: "adidas",
    price: 179.99,
    salePrice: 0,
    totalStock: 30,
    averageReview: 4.8,
    image: "https://images.unsplash.com/photo-1580902394724-b08ff9ba7e8a?w=700&auto=format&fit=crop&q=60"
  },
  {
    title: "Adidas Originals Trefoil Tee",
    description: "Classic cotton t-shirt with Trefoil logo.",
    category: "women",
    brand: "adidas",
    price: 29.99,
    salePrice: 19.99,
    totalStock: 60,
    averageReview: 4.6,
    image: "https://images.unsplash.com/photo-1615064779799-df1bfcc66ed0?w=700&auto=format&fit=crop&q=60"
  },
  {
    title: "Puma RS-X",
    description: "Retro-inspired sneakers with bold design",
    category: "footwear",
    brand: "puma",
    price: 89.99,
    salePrice: 69.99,
    totalStock: 25,
    averageReview: 4.2,
    image: "https://images.unsplash.com/photo-1619253341026-74c609e6ce50?w=700&auto=format&fit=crop&q=60"
  },
  {
    title: "H&M Kids T-Shirt",
    description: "Comfortable cotton t-shirt for kids",
    category: "kids",
    brand: "h&m",
    price: 19.99,
    salePrice: 0,
    totalStock: 75,
    averageReview: 4.1,
    image: "https://images.unsplash.com/photo-1664982803698-b6b514e9928b?auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Ray-Ban Aviator Sunglasses",
    description: "Classic aviator sunglasses for all occasions.",
    category: "accessories",
    brand: "rayban",
    price: 149.99,
    salePrice: 129.99,
    totalStock: 20,
    averageReview: 4.8,
    image: "https://images.unsplash.com/photo-1662807031127-861cdf9ab76b?auto=format&fit=crop&w=500&q=80"
  }
];

// Sample feature images for banner
const sampleFeatureImages = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop"
  },
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&fit=crop"
  },
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce");
    console.log("Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Feature.deleteMany({});
    console.log("Cleared existing data");

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} products`);

    // Insert sample feature images
    const features = await Feature.insertMany(sampleFeatureImages);
    console.log(`Inserted ${features.length} feature images`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase(); 