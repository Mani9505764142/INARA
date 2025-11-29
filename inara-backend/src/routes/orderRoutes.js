// src/routes/orderRoutes.js
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getInvoicePdf,
  markOrderPaid, // <- added
} = require("../controllers/orderController");

const { requireAdminAuth } = require("../middleware/adminAuth");

// Public: customer places an order
router.post("/", createOrder);

// Public: finalize payment (called by frontend after server-side Razorpay verification or by server-to-server flow)
// This endpoint updates paymentId/paymentOrderId/paymentSignature and sets paymentStatus to PAID
router.patch("/:id/pay", markOrderPaid);

// Admin: list + update orders
router.get("/", requireAdminAuth, getOrders);
// PATCH because we only update status field (not replacing whole document)
router.patch("/:id/status", requireAdminAuth, updateOrderStatus);

// Admin: download invoice PDF
router.get("/:id/invoice", requireAdminAuth, getInvoicePdf);

module.exports = router;
