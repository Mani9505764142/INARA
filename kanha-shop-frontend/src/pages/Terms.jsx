// src/pages/Terms.jsx
import React from "react";
import { Container, Typography, Box } from "@mui/material";

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Terms & Conditions
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Orders & Payments</Typography>
        <Typography>
          • Orders are confirmed only after full payment is received. <br />
          • Prices shown on the website are in INR and may change without
          notice until the order is confirmed.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Handmade Products</Typography>
        <Typography>
          • Each item is handmade, so minor variations in colour, texture or
          size are expected. <br />
          • Product photos are for reference; the final piece may not be 100%
          identical.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Shipping & Delivery</Typography>
        <Typography>
          • Delivery timelines are estimates. Courier delays are outside our
          control. <br />
          • If a parcel is returned due to an incorrect address or unreachable
          phone number, re-shipping charges will apply.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Returns & Cancellations</Typography>
        <Typography>
          • Because most items are customised, we do not accept returns unless
          the product is damaged on arrival. <br />
          • Damage claims must be raised within 24 hours with unboxing photos /
          videos.
        </Typography>
      </Box>
    </Container>
  );
}
