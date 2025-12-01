// src/controllers/paymentController.js
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order");

const toNumber = (v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
};

/**
 * createOrder
 * - Validates input strictly (returns clear 400 errors)
 * - Creates a Razorpay order
 * - Creates a local DB order with paymentStatus: "PENDING" and paymentOrderId set
 * - Returns { success: true, orderId, order (razorpay), key_id }
 */
exports.createOrder = async (req, res) => {
  try {
    // Guard: empty or malformed body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Empty request body" });
    }

    // Safe destructure
    const {
      amount,
      subtotal,
      total,
      shippingFee,
      items,
      customerName,
      phone,
      address,
      pincode
    } = req.body;

    // Validate required fields with explicit errors
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items is required and must be a non-empty array" });
    }
    if (subtotal === undefined || subtotal === null || Number.isNaN(Number(subtotal))) {
      return res.status(400).json({ error: "subtotal is required and must be a number" });
    }
    if (total === undefined || total === null || Number.isNaN(Number(total))) {
      return res.status(400).json({ error: "total is required and must be a number" });
    }
    if (!pincode) {
      return res.status(400).json({ error: "pincode is required" });
    }
    if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: "amount is required and must be a number" });
    }

    // Normalize & validate amount
    const n = toNumber(amount);
    if (!Number.isFinite(n) || n <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    // convert to paise if rupees (heuristic: <1000 => rupees)
    const amountInPaise = n < 1000 ? Math.round(n * 100) : Math.round(n);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    // Create Razorpay order
    const rpOrder = await razorpay.orders.create(options);

    // Build DB order payload
    const orderDocPayload = {
      items: items,
      customerName: customerName || "Customer",
      phone: phone || null,
      address: address || null,
      pincode,
      shippingFee: Number(shippingFee || 0),
      subtotal: Number(subtotal),
      total: Number(total),
      amount: Number(amount),
      paymentOrderId: rpOrder.id,
      paymentStatus: "PENDING",
      status: "PENDING",
      createdAt: new Date()
    };

    // Safety check before save
    if (!Number.isFinite(orderDocPayload.subtotal) || !Number.isFinite(orderDocPayload.total)) {
      return res.status(400).json({ error: "Invalid subtotal or total" });
    }

    // Create DB order
    const order = await Order.create(orderDocPayload);

    return res.json({
      success: true,
      orderId: order._id.toString(),
      order: rpOrder,
      key_id: process.env.RAZORPAY_KEY_ID || null
    });
  } catch (err) {
    console.error("createOrder failed:", err && (err.stack || err.message || err));
    return res.status(500).json({ error: "Order creation failed" });
  }
};

/**
 * verifyPayment
 * - Validates Razorpay HMAC signature with server secret
 * - Atomically marks DB order as PAID (idempotent)
 * - Returns { ok: true, orderId } on success
 */
exports.verifyPayment = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ ok: false, error: "Empty request body" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ ok: false, error: "Missing params" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      console.warn("verifyPayment: invalid signature", { razorpay_order_id });
      return res.status(400).json({ ok: false, error: "Invalid signature" });
    }

    // Atomic update - set PAID only if not already PAID
    const updated = await Order.findOneAndUpdate(
      { paymentOrderId: razorpay_order_id, paymentStatus: { $ne: "PAID" } },
      {
        $set: {
          paymentId: razorpay_payment_id,
          paymentSignature: razorpay_signature,
          paymentStatus: "PAID",
          status: "CONFIRMED",
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (updated) {
      return res.json({ ok: true, orderId: updated._id.toString() });
    }

    // If not updated, check whether it was already paid
    const maybe = await Order.findOne({ paymentOrderId: razorpay_order_id }).lean();
    if (maybe && maybe.paymentStatus === "PAID") {
      return res.json({ ok: true, orderId: maybe._id.toString() });
    }

    return res.status(404).json({ ok: false, error: "Order not found for verification" });
  } catch (err) {
    console.error("verifyPayment failed:", err && (err.stack || err.message || err));
    return res.status(500).json({ ok: false, error: "Verification failed" });
  }
};
