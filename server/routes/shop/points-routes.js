const express = require("express");
const { redeemItem, getUserPoints } = require("../../controllers/shop/points-controller");

const router = express.Router();

// Redeem an item via points
router.post("/redeem", redeemItem);
// Get user points balance
router.get("/user/:userId", getUserPoints);

module.exports = router; 