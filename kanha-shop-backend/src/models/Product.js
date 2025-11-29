// src/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    imageUrl: { type: String, required: true, trim: true },
    category: { type: String, default: "", trim: true },
    inStock: { type: Boolean, default: true },

    // ⭐ NEW FLAGS
    isTopSelling: { type: Boolean, default: false },
    isOfferProduct: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
