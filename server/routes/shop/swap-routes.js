const express = require("express");
const {
  createSwap,
  listUserSwaps,
  listAllSwaps,
  updateSwapStatus,
} = require("../../controllers/shop/swap-controller");

const router = express.Router();

// Create a swap request
router.post("/create", createSwap);
// List swaps for a user
router.get("/user/:userId", listUserSwaps);
// List all swaps (admin)
router.get("/all", listAllSwaps);
// Update swap status
router.put("/update/:id", updateSwapStatus);

module.exports = router; 