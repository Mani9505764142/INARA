// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api/client";

const EMPTY_PRODUCT = {
  title: "",
  price: "",
  description: "",
  imageUrl: "",
  category: "",
  inStock: true,
  isTopSelling: false,
  isOfferProduct: false,
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null); // product being edited or null
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateDialog = () => {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setDialogOpen(true);
  };

  const openEditDialog = (p) => {
    setEditing(p);
    setForm({
      title: p.title || "",
      price: p.price || "",
      description: p.description || "",
      imageUrl: p.imageUrl || "",
      category: p.category || "",
      inStock: p.inStock !== false,
      isTopSelling: !!p.isTopSelling,
      isOfferProduct: !!p.isOfferProduct,
    });
    setDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      alert("Title and price are required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        price: Number(form.price),
      };

      if (editing) {
        const res = await api.put(`/products/${editing._id}`, payload);
        const updated = res.data;
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
      } else {
        const res = await api.post("/products", payload);
        const created = res.data;
        setProducts((prev) => [created, ...prev]);
      }

      setDialogOpen(false);
      setEditing(null);
      setForm(EMPTY_PRODUCT);
    } catch (err) {
      console.error("Save product error:", err);
      alert("Failed to save product. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete product "${product.title}"?`)) return;

    try {
      await api.delete(`/products/${product._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Failed to delete product.");
    }
  };

  // upload image to backend (/api/upload)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.url) {
        handleFormChange("imageUrl", res.data.url);
      } else {
        alert("Upload failed: no URL returned");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Button variant="contained" onClick={openCreateDialog}>
          Add product
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography color="text.secondary">
            No products yet. Click &quot;Add product&quot; to create one.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price (₹)</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          style={{
                            width: 56,
                            height: 56,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 1,
                            bgcolor: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            color: "text.secondary",
                          }}
                        >
                          No image
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.price}</TableCell>
                    <TableCell>
                      {p.inStock ? (
                        <Chip label="In stock" color="success" size="small" />
                      ) : (
                        <Chip label="Out of stock" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {p.isTopSelling && (
                          <Chip label="Top" color="success" size="small" />
                        )}
                        {p.isOfferProduct && (
                          <Chip label="Offer" color="warning" size="small" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(p)}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(p)}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add / Edit dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSave}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Price (₹)"
              type="number"
              value={form.price}
              onChange={(e) => handleFormChange("price", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Category"
              value={form.category}
              onChange={(e) => handleFormChange("category", e.target.value)}
              fullWidth
            />

            {/* Image upload + URL */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="outlined"
                component="label"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload image"}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              {uploading && <LinearProgress />}

              <TextField
                label="Image URL"
                value={form.imageUrl}
                onChange={(e) => handleFormChange("imageUrl", e.target.value)}
                fullWidth
                helperText="Filled automatically after upload; you can also paste a URL."
              />
            </Box>

            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.inStock}
                  onChange={(e) =>
                    handleFormChange("inStock", e.target.checked)
                  }
                />
              }
              label="In stock"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.isTopSelling}
                  onChange={(e) =>
                    handleFormChange("isTopSelling", e.target.checked)
                  }
                />
              }
              label="Top selling product"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.isOfferProduct}
                  onChange={(e) =>
                    handleFormChange("isOfferProduct", e.target.checked)
                  }
                />
              }
              label="Offer product"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
