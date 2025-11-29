// src/pages/product.jsx (frontend shop)
import React, { useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Pagination from "@mui/material/Pagination";
import ProductCard from "../components/ProductCard";
import api from "../api/client";

const ITEMS_PER_PAGE = 6;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Categories from products
  const categories = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return ["all"];
    const set = new Set();
    products.forEach((p) => p.category && set.add(p.category));
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  // Filter + sort
  const filteredSorted = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const term = (query || "").trim().toLowerCase();

    let list = products.filter((p) => {
      if (activeCategory !== "all") {
        if (!p.category || p.category !== activeCategory) return false;
      }

      if (term) {
        const name = (p.title || p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        if (!name.includes(term) && !desc.includes(term)) return false;
      }

      return true;
    });

    const score = (p) => (p.isTopSelling ? 2 : 0) + (p.isOfferProduct ? 1 : 0);

    return list.slice().sort((a, b) => score(b) - score(a));
  }, [products, activeCategory, query]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeCategory, query]);

  const pageCount = Math.max(1, Math.ceil(filteredSorted.length / ITEMS_PER_PAGE));

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredSorted.slice(start, end);
  }, [filteredSorted, page]);

  const onClearFilters = () => {
    setActiveCategory("all");
    setQuery("");
  };

  const handlePageChange = (_, value) => {
    setPage(value);
    // scroll to top of product list if needed
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container
      id="products"
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        pt: 4,
        pb: 8,
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800 }}>
        Products
      </Typography>

      {/* Small branded note — added per request */}
      <Typography
        sx={{
          mt: 1,
          mb: 3,
          fontSize: "15px",
          color: "#7c1414",
          background: "#f9e9e4",
          p: "10px 14px",
          borderRadius: "8px",
          maxWidth: { xs: "100%", md: "640px" },
          boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
        }}
      >
        If you want a custom design or colour, contact our specialised design team.
      </Typography>

      {/* Filter bar */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Category chips */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat === "all" ? "All" : cat}
              color={activeCategory === cat ? "primary" : "default"}
              variant={activeCategory === cat ? "filled" : "outlined"}
              onClick={() => setActiveCategory(cat)}
              sx={{ textTransform: "none", cursor: "pointer" }}
            />
          ))}
        </Box>

        {/* search */}
        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            py: 0.25,
            ml: "auto",
            minWidth: 220,
            maxWidth: 420,
          }}
          elevation={0}
        >
          <IconButton sx={{ p: "8px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search products..."
            inputProps={{ "aria-label": "search products" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {(query || activeCategory !== "all") && (
            <IconButton
              sx={{ p: "8px" }}
              aria-label="clear"
              onClick={onClearFilters}
              title="Clear filters"
            >
              <ClearIcon />
            </IconButton>
          )}
        </Paper>
      </Box>

      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Loading products...
        </Typography>
      )}
      {error && !loading && (
        <Typography variant="body2" color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      {/* Product grid – fluid, non-overflowing */}
      {!loading && pagedProducts.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            width: "100%",
            boxSizing: "border-box",
            overflowX: "hidden", // defensive
            alignItems: "start",
          }}
        >
          {pagedProducts.map((p) => (
            <Box
              key={p._id}
              sx={{
                display: "flex",
                width: "100%",     // fill column
                minWidth: 0,       // CRITICAL to allow shrinking
                boxSizing: "border-box",
              }}
            >
              <ProductCard
                product={{
                  id: p._id,
                  title: p.title,
                  price: p.price,
                  image: p.imageUrl || "/placeholder-product.png",
                  description: p.description,
                  category: p.category,
                  inStock: p.inStock !== false,
                  isTopSelling: p.isTopSelling,
                  isOfferProduct: p.isOfferProduct,
                }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        !loading && (
          <Typography color="text.secondary">No products found for these filters.</Typography>
        )
      )}

      {/* Pagination */}
      {!loading && filteredSorted.length > ITEMS_PER_PAGE && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      )}
    </Container>
  );
}
