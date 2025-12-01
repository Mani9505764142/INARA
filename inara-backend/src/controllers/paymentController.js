// src/controllers/paymentController.js
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order"); // adjust path if your model is elsewhere

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
 * - Creates a Razorpay order
 * - Creates a local DB order with paymentStatus: "PENDING" and paymentOrderId set
 * - Returns { orderId, order (razorpay order), key_id }
 */
exports.createOrder = async (req, res) => {
  try {
    const { amount, customerName, phone, address, items } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: "Amount required (in rupees or paise)" });
    }

    const n = toNumber(amount);
    if (!Number.isFinite(n) || n <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Treat <1000 as rupees, else assume paise
    const amountInPaise = n < 1000 ? Math.round(n * 100) : Math.round(n);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    // create razorpay order
    const rpOrder = await razorpay.orders.create(options);

    // create a pending order in DB - idempotent if frontend retries createOrder (you can use receipt to dedupe)
    const orderDoc = await Order.create({
      items: items || [],
      customerName: customerName || null,
      phone: phone || null,
      address: address || null,
      amount: n, // store as rupees if input was rupees, else paise numeric; consistent with your app
      paymentOrderId: rpOrder.id,
      paymentStatus: "PENDING",
      status: "PENDING",
      createdAt: new Date()
    });

    return res.json({
      success: true,
      orderId: orderDoc._id.toString(),
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
 * - Validates HMAC signature
 * - Atomically marks DB order as PAID (idempotent)
 * - Returns { ok: true, orderId } on success
 */
exports.verifyPayment = async (req, res) => {
  try {
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

    // atomic update: set PAID only if not already PAID
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
      // success: order was found and updated to PAID
      return res.json({ ok: true, orderId: updated._id.toString() });
    }

    // maybe it's already paid or not found. handle both
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
