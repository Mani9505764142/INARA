// src/controllers/productController.js
const Product = require("../models/Product");

// ===============================
// GET ALL PRODUCTS (PUBLIC)
// ===============================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

// ===============================
// GET SINGLE PRODUCT BY ID
// ===============================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Get product by ID error:", err);
    res.status(400).json({ message: "Invalid product ID" });
  }
};

// ===============================
// ADD PRODUCT (ADMIN)
// ===============================
exports.addProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      category,
      inStock,
      imageUrl,
      isTopSelling,
      isOfferProduct,
    } = req.body;

    if (!title || price == null) {
      return res.status(400).json({
        message: "Required fields missing: title, price",
      });
    }

    const product = await Product.create({
      title,
      price,
      description: description || "",
      category: category || "",
      inStock: inStock ?? true,
      imageUrl: imageUrl || "",
      isTopSelling: !!isTopSelling,
      isOfferProduct: !!isOfferProduct,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

// ===============================
// UPDATE PRODUCT (ADMIN)
// ===============================
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const update = {};

    // Only update fields if they were sent
    const fields = [
      "title",
      "price",
      "description",
      "category",
      "inStock",
      "imageUrl",
      "isTopSelling",
      "isOfferProduct",
    ];

    fields.forEach((key) => {
      if (req.body[key] !== undefined) {
        update[key] = req.body[key];
      }
    });

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({
      message: "Server error while updating product",
    });
  }
};

// ===============================
// DELETE PRODUCT (ADMIN)
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};
