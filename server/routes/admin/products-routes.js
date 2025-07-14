const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
  approveProduct,
  rejectProduct,
  fetchUnapprovedProducts,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);
router.get("/unapproved", fetchUnapprovedProducts);
router.put("/approve/:id", approveProduct);
router.delete("/reject/:id", rejectProduct);

module.exports = router;
