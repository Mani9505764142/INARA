// src/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // price per unit (in rupees)
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      required: true,
    },

    customerName: { type: String, required: true },
    customerEmail: { type: String, required: false }, // optional but useful
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },

    shippingFee: {
      type: Number,
      default: 40,
    },

    // Monetary fields stored as Numbers in rupees (not paise) for convenience
    subtotal: { type: Number, required: true }, // sum of item.price * qty
    total: { type: Number, required: true }, // subtotal + shipping + taxes if any
    amount: { type: Number, required: true }, // duplicate for legacy uses (keep consistent)

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      default: "ONLINE",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    paymentId: { type: String }, // razorpay payment id (pay_...)
    paymentOrderId: { type: String, index: true }, // razorpay order id (order_...) - indexed
    paymentSignature: { type: String },

    status: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "CONFIRMED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// Optional: unique index on paymentOrderId if you guarantee 1:1 mapping
// If you create DB order first and then create Razorpay order for same DB order,
// you can enforce uniqueness to avoid duplicates.
orderSchema.index({ paymentOrderId: 1 }, { unique: true, partialFilterExpression: { paymentOrderId: { $type: "string" } } });

module.exports = mongoose.model("Order", orderSchema);
