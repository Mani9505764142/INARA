import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then(list => {
        if (mounted) setProducts(list);
      })
      .catch(err => {
        console.error("Failed to load products", err);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            color: "primary.main",
            mb: 2,
          }}
        >
          Handmade with Love
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          Authentic handcrafted jewelry & cultural art
        </Typography>

        <Button variant="contained" color="secondary" href="#products">
          Explore Collection
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Popular Products
      </Typography>

      {loading ? (
        <Typography>Loading products…</Typography>
      ) : (
        <Grid container spacing={2} id="products">
          {products.map(p => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
