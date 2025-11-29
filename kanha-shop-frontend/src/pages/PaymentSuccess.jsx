import React from "react";
import { useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const q = new URLSearchParams(useLocation().search);
  const order = q.get("order");
  const payment = q.get("payment");

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ color: "#16a34a" }}>Payment Successful ✅</h1>
      <p style={{ marginTop: 12 }}>
        <strong>Order ID:</strong> {order}
      </p>
      <p>
        <strong>Payment ID:</strong> {payment}
      </p>
      <p style={{ marginTop: 18 }}>
        Thank you — your payment was successful. Click below to return to the shop.
      </p>
      <a href="/" style={{ display: "inline-block", marginTop: 16, padding: "8px 12px", background: "#2563eb", color: "#fff", borderRadius: 6, textDecoration: "none" }}>
        Back to shop
      </a>
    </div>
  );
}
