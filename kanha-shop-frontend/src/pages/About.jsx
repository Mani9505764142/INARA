import React from "react";
import { Container, Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        About INARA
      </Typography>

      <Typography sx={{ mb: 2 }}>
        INARA is a handcrafted jewelry and traditional craft brand focused on
        personalised gifting — resin art, keychains, bracelets, bangles and
        custom-made accessories.
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Every piece is made in small batches, often to order. Slight variations
        in colour or patterns are part of the charm of handmade work — not a
        defect.
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Our promise is simple: clean designs, fair pricing, honest work and
        clear communication with customers throughout the order process.
      </Typography>
    </Container>
  );
}
