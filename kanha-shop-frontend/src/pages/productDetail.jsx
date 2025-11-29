// src/components/ProductCard.jsx
import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const image = product.imageUrl || "/placeholder-product.png";

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        bgcolor: "transparent",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 2 }}>
        <CardMedia
          component="img"
          image={image}
          alt={product.title}
          sx={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderRadius: 1.5,
            boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
          }}
        />
      </Box>

      <CardContent sx={{ pt: 0, flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1 }}
          component="h3"
        >
          {product.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          ₹{product.price}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
          {product.isTopSelling && <Chip label="Top" color="success" size="small" />}
          {product.isOfferProduct && <Chip label="Offer" color="warning" size="small" />}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1, flexWrap: "wrap" }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onAddToCart && onAddToCart(product)}
          sx={{
            textTransform: "uppercase",
            fontWeight: 800,
          }}
        >
          Add to cart
        </Button>

        {/* Quick view kept — Pay button REMOVED intentionally */}
        <Button
          size="small"
          variant="outlined"
          onClick={() => onQuickView && onQuickView(product)}
          sx={{ textTransform: "none" }}
        >
          Quick view
        </Button>

        {/* If you had a Pay button previously, remove it from your markup.
            If you *must* show a payment CTA somewhere else, add it to the
            product detail page (ProductDetail) or Checkout flow only. */}
      </CardActions>
    </Card>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func,
  onQuickView: PropTypes.func,
};
