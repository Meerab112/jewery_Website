const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Routes
router.post("/add", authMiddleware, adminMiddleware, addProduct);

router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
