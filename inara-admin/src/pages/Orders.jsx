// src/pages/Orders.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import api from "../api/client";

const ORDERS_PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  // -----------------------------
  // LOAD ORDERS (Admin protected via cookie)
  // -----------------------------
  const loadOrders = async () => {
    try {
      setLoading(true);

      // Use axios client withCredentials; do NOT send Authorization header from localStorage
      const res = await api.get("/orders");

      // backend may return { success: true, data: [...] } or an array directly.
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data?.data) data = res.data.data;
      else if (res.data?.orders) data = res.data.orders;
      else if (res.data?.success && res.data?.payload) data = res.data.payload;
      else data = Array.isArray(res.data) ? res.data : [];

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  // --------------------------------
  // UPDATE ORDER STATUS (PATCH)
  // --------------------------------
  const handleStatusChange = async (orderId, status) => {
    try {
      setSavingId(orderId);

      // Use cookie auth - api client sends cookie automatically
      await api.patch(`/orders/${orderId}/status`, { status });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Try again.");
    } finally {
      setSavingId(null);
    }
  };

  // --------------------------
  // INVOICE DOWNLOAD HANDLER
  // --------------------------
  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice error:", err);
      alert("Invoice unavailable.");
    }
  };

  // -------------------------
  // CHIPS
  // -------------------------
  const renderPaymentChip = (status) => {
    const s = (status || "PENDING").toUpperCase();
    if (s === "PAID") return <Chip label="Paid" color="success" size="small" />;
    if (s === "FAILED") return <Chip label="Failed" color="error" size="small" />;
    return <Chip label="Pending" color="warning" size="small" />;
  };

  const renderOrderStatusChip = (status) => {
    const s = (status || "PENDING").toUpperCase();
    const colorMap = {
      PENDING: "warning",
      CONFIRMED: "info", // DB uses CONFIRMED for paid/confirmed orders
      SHIPPED: "info",
      DELIVERED: "success",
      CANCELLED: "error",
    };
    const color = colorMap[s] || "default";
    return <Chip label={s} color={color} size="small" />;
  };

  // --------------------------
  // TOTAL CALCULATIONS
  // --------------------------
  const calcItemsTotal = (o) =>
    o.items?.reduce(
      (sum, it) =>
        sum +
        (it.price || 0) * (it.quantity != null ? it.quantity : it.qty || 0),
      0
    ) || 0;

  const calcGrandTotal = (o) => calcItemsTotal(o) + (o.shippingFee || 0);

  // --------------------------
  // FILTER + SEARCH
  // --------------------------
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((o) => {
      if (statusFilter !== "ALL") {
        // normalize status from backend and compare
        const s = (o.status || "PENDING").toUpperCase();
        if (s !== statusFilter) return false;
      }

      if (term) {
        if (
          !o.customerName?.toLowerCase().includes(term) &&
          !o.phone?.toLowerCase().includes(term)
        )
          return false;
      }

      return true;
    });
  }, [orders, statusFilter, search]);

  // --------------------------
  // PAGINATION
  // --------------------------
  const totalPages =
    filteredOrders.length === 0
      ? 1
      : Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, page]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Orders
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ToggleButtonGroup
          size="small"
          value={statusFilter}
          exclusive
          onChange={(_, val) => val && setStatusFilter(val)}
        >
          <ToggleButton value="ALL">All</ToggleButton>
          <ToggleButton value="PENDING">Pending</ToggleButton>
          <ToggleButton value="CONFIRMED">Confirmed</ToggleButton>
          <ToggleButton value="SHIPPED">Shipped</ToggleButton>
          <ToggleButton value="DELIVERED">Delivered</ToggleButton>
          <ToggleButton value="CANCELLED">Cancelled</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          size="small"
          label="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260 }}
        />
      </Box>

      {/* Orders table */}
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Typography color="text.secondary">No orders found.</Typography>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Total (₹)</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedOrders.map((o) => (
                    <TableRow key={o._id}>
                      <TableCell sx={{ maxWidth: 180 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            wordBreak: "break-all",
                          }}
                        >
                          {o._id}
                        </Typography>
                      </TableCell>

                      <TableCell>{o.customerName}</TableCell>
                      <TableCell>{o.phone}</TableCell>
                      <TableCell>{calcGrandTotal(o)}</TableCell>
                      <TableCell>{renderPaymentChip(o.paymentStatus)}</TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {renderOrderStatusChip(o.status)}
                          <Select
                            size="small"
                            value={(o.status || "PENDING").toUpperCase()}
                            onChange={(e) =>
                              handleStatusChange(o._id, e.target.value)
                            }
                            disabled={savingId === o._id}
                            sx={{ minWidth: 110 }}
                          >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                            <MenuItem value="SHIPPED">Shipped</MenuItem>
                            <MenuItem value="DELIVERED">Delivered</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                          </Select>
                        </Box>
                      </TableCell>

                      <TableCell>
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleString("en-IN", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "-"}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadInvoice(o._id)}
                          title="Download invoice"
                          sx={{ mr: 1 }}
                        >
                          <PictureAsPdfIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => setSelectedOrder(o)}
                          title="View details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Stack direction="row" justifyContent="center" sx={{ mt: 2, mb: 1 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_e, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            )}
          </>
        )}
      </Paper>

      {/* Order details Dialog */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Order details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order ID
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
              >
                {selectedOrder._id}
              </Typography>

              <Divider />

              <Typography variant="subtitle2" color="text.secondary">
                Customer
              </Typography>
              <Typography variant="body1">{selectedOrder.customerName}</Typography>
              <Typography variant="body2">
                Phone: {selectedOrder.phone}
              </Typography>
              <Typography variant="body2">
                Pincode: {selectedOrder.pincode}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                Address: {selectedOrder.address}
              </Typography>

              <Divider />

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Items
              </Typography>

              <List dense>
                {selectedOrder.items?.map((it, idx) => (
                  <ListItem
                    key={idx}
                    disableGutters
                    secondaryAction={
                      <Typography variant="body2">
                        ₹
                        {(it.price || 0) *
                          (it.quantity != null ? it.quantity : it.qty || 0)}
                      </Typography>
                    }
                  >
                    <ListItemText
                      primary={`${it.title} × ${
                        it.quantity != null ? it.quantity : it.qty || 0
                      }`}
                      secondary={`₹${it.price || 0} each`}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="body2" sx={{ textAlign: "right", mt: 1 }}>
                Subtotal: ₹{calcItemsTotal(selectedOrder)}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                Shipping: ₹{selectedOrder.shippingFee || 0}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ textAlign: "right", fontWeight: 700, mt: 0.5 }}
              >
                Total: ₹{calcGrandTotal(selectedOrder)}
              </Typography>

              <Divider />

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment
                  </Typography>
                  <Typography variant="body2">
                    Method: {selectedOrder.paymentMethod}
                  </Typography>
                  <Typography variant="body2">
                    Status: {selectedOrder.paymentStatus}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body2">
                    {(selectedOrder.status || "PENDING")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
