const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { requireAdminAuth } = require("../middleware/adminAuth");

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", requireAdminAuth, addProduct);
router.put("/:id", requireAdminAuth, updateProduct);
router.delete("/:id", requireAdminAuth, deleteProduct);

module.exports = router;
