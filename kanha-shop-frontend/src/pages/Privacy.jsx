// src/pages/Privacy.jsx
import React from "react";
import { Container, Typography, Box } from "@mui/material";

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Privacy Policy
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Information We Collect</Typography>
        <Typography>
          We collect basic details such as your name, phone number, delivery
          address and order details to process your order and contact you on
          WhatsApp / phone.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">How We Use Your Information</Typography>
        <Typography>
          • To confirm and deliver your orders. <br />
          • To share order updates or resolve any issues. <br />
          • We do not sell or share your personal data with third parties for
          marketing.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Payments</Typography>
        <Typography>
          Payments are processed through secure third-party gateways (UPI,
          Razorpay, etc.). We do not store your card or UPI PIN details on our
          servers.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Contact</Typography>
        <Typography>
          For any privacy questions, you can contact us on the WhatsApp number
          shown on the website.
        </Typography>
      </Box>
    </Container>
  );
}
