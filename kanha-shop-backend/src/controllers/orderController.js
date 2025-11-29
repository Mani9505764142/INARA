// src/controllers/orderController.js
const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

// helper: subtotal from items only
const calcItemsTotal = (o) =>
  o.items?.reduce((sum, it) => sum + (it.price || 0) * (it.quantity != null ? it.quantity : it.qty || 0), 0) || 0;

// ----------------- CREATE ORDER (frontend checkout) -----------------
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      customerName,
      phone,
      address,
      pincode,
      paymentMethod,
      paymentStatus,
      paymentId,
      paymentOrderId,
      paymentSignature,
      shippingFee, // optional from frontend
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    // Normalize paymentStatus to uppercase and default to PENDING
    const normalizedPaymentStatus =
      (paymentStatus && String(paymentStatus).toUpperCase()) || "PENDING";

    const order = await Order.create({
      items,
      customerName,
      phone,
      address,
      pincode,
      paymentMethod: paymentMethod || "ONLINE",
      paymentStatus: normalizedPaymentStatus,
      paymentId,
      paymentOrderId,
      paymentSignature,
      shippingFee: shippingFee != null ? shippingFee : undefined,
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error while creating order" });
  }
};

// ----------------- LIST ORDERS (admin) -----------------
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// ----------------- UPDATE STATUS (admin) -----------------
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
    const statusUpper = String(status || "").toUpperCase();

    if (!allowedStatuses.includes(statusUpper)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = statusUpper;
    await order.save();

    res.json({ message: "Status updated", status: order.status });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error while updating order status" });
  }
};

// ----------------- MARK ORDER PAID (after successful Razorpay + verification) -----------------
exports.markOrderPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId, paymentOrderId, paymentSignature, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = (paymentStatus && String(paymentStatus).toUpperCase()) || "PAID";
    if (paymentId) order.paymentId = paymentId;
    if (paymentOrderId) order.paymentOrderId = paymentOrderId;
    if (paymentSignature) order.paymentSignature = paymentSignature;

    await order.save();

    res.json({ ok: true, message: "Order marked as paid", paymentStatus: order.paymentStatus });
  } catch (err) {
    console.error("markOrderPaid error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- INVOICE PDF (admin) -----------------
exports.getInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const subtotal = calcItemsTotal(order);
    const shipping = order.shippingFee != null ? order.shippingFee : 40;
    const total = subtotal + shipping;

    // headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="invoice-${order._id}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // ---- Header ----
    doc.fontSize(22).text("Kanha Creations", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Invoice #${order._id}`, { align: "center" });
    doc.moveDown(2);

    // ---- Bill To ----
    doc.fontSize(12).text("Bill To:", { underline: true });
    doc.moveDown(0.3);
    doc.text(order.customerName || "");
    doc.text(`Phone: ${order.phone || ""}`);
    doc.text(`Pincode: ${order.pincode || ""}`);
    doc.text(`Address: ${order.address || ""}`);
    doc.moveDown(1);

    // ---- Meta ----
    const created = order.createdAt && !isNaN(new Date(order.createdAt)) ? new Date(order.createdAt).toLocaleString("en-IN") : "";
    doc.text(`Date: ${created}`);
    doc.text(`Payment: ${order.paymentMethod} (${order.paymentStatus})`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown(1.5);

    // ---- Items table header ----
    doc.fontSize(13).text("Items", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 320;
    const priceX = 380;
    const totalX = 460;

    doc.fontSize(12);
    doc.text("Item", itemX, tableTop);
    doc.text("Qty", qtyX, tableTop);
    doc.text("Price", priceX, tableTop);
    doc.text("Total", totalX, tableTop);

    doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.moveDown(0.5);

    // ---- Items rows ----
    let y = tableTop + 25;
    order.items.forEach((it) => {
      const q = it.quantity != null ? it.quantity : it.qty || 0;
      const p = it.price || 0;
      const lineTotal = q * p;

      doc.text(it.title || "", itemX, y, { width: 260 });
      doc.text(String(q), qtyX, y);
      doc.text(`₹${p}`, priceX, y);
      doc.text(`₹${lineTotal}`, totalX, y);

      y += 18;
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
    });

    doc.moveDown(2);

    // ---- Summary ----
    doc.fontSize(12).text(`Subtotal: ₹${subtotal}`, { align: "right" })
       .text(`Shipping: ₹${shipping}`, { align: "right" })
       .fontSize(13).text(`Total: ₹${total}`, { align: "right", underline: true });

    doc.moveDown(2);
    doc.fontSize(11).text("Thank you for shopping with Kanha Creations.", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Invoice PDF error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error while generating invoice" });
    } else {
      res.end();
    }
  }
};
