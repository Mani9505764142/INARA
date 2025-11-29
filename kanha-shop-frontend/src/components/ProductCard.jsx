import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const id = product.id || product.productId || product.sku;
  const inStock = product.inStock !== false;
  const [openQuick, setOpenQuick] = useState(false);

  const onAdd = () => {
    if (!inStock) return;
    addItem(
      {
        id: id || product.title,
        title: product.title,
        price: product.price,
        image: product.image,
      },
      1
    );
  };

  const openQuickView = () => setOpenQuick(true);
  const closeQuickView = () => setOpenQuick(false);

  return (
    <>
      <Card
        tabIndex={0}
        role="button"
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          transition:
            "transform 260ms cubic-bezier(.2,.9,.24,1), box-shadow 260ms ease, filter 260ms ease",
          "&:hover, &:focus": {
            transform: "translateY(-8px)",
            boxShadow: "0 26px 60px rgba(0,0,0,0.18)",
            filter: "brightness(1.02)",
          },
        }}
      >
        <Box
          component={Link}
          to={id ? `/product/${id}` : "/product"}
          sx={{
            textDecoration: "none",
            color: "inherit",
            position: "relative",
            display: "block",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              position: "relative",
              overflow: "hidden",
              borderRadius: 0,
              pt: { xs: "56.25%", sm: "56.25%", md: "50%" },
              backgroundColor: "#f7f3f0",
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {!inStock && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  px: 1.2,
                  py: 0.4,
                  borderRadius: 999,
                  bgcolor: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Out of stock
              </Box>
            )}
          </Box>
        </Box>

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
            p: 2,
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              minHeight: 28,
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {product.isTopSelling && (
              <Chip label="Top" color="success" size="small" />
            )}
            {product.isOfferProduct && (
              <Chip label="Offer" color="warning" size="small" />
            )}
          </Box>

          <Box
            component={Link}
            to={id ? `/product/${id}` : "/product"}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, mb: 0.5, lineHeight: 1.15 }}
            >
              {product.title}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ₹{product.price}
          </Typography>

          {/* ACTION ROW */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: "auto", flexWrap: "wrap", gap: 1 }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={onAdd}
              disabled={!inStock}
              sx={{
                textTransform: "uppercase",
                borderRadius: 2,
                fontWeight: 800,
                py: { xs: 1.05, md: 1.15 },
                background: inStock
                  ? "linear-gradient(180deg, #7e2626 0%, #6a1f1f 100%)"
                  : "rgba(0,0,0,0.12)",
                color: inStock ? "#fff" : "text.disabled",
                "&:hover": inStock
                  ? {
                      background:
                        "linear-gradient(180deg, #8b2f2f 0%, #6e2222 100%)",
                    }
                  : {},
                flex: "1 1 auto",
                minWidth: 0,
              }}
            >
              {inStock ? "Add to cart" : "Out of stock"}
            </Button>

            <Button
              variant="outlined"
              onClick={openQuickView}
              sx={{
                minWidth: { xs: 84, sm: 120 },
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                flex: "0 0 auto",
              }}
            >
              Quick view
            </Button>

            {/* Pay button removed as requested */}
          </Stack>
        </CardContent>
      </Card>

      <QuickViewModal
        open={openQuick}
        onClose={closeQuickView}
        product={{
          id,
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
          inStock,
        }}
        onAdd={onAdd}
      />
    </>
  );
}
