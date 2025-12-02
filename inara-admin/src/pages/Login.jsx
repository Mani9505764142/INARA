// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const storeTokenIfPresent = (res) => {
    const token =
      res?.data?.token || res?.data?.data?.token || res?.data?.accessToken;
    if (token) {
      try {
        localStorage.setItem("adminToken", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        // ignore storage errors
      }
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // 1) Try token-based login first (recommended)
      // Many backends return { success: true, token: "..." } or similar.
      try {
        const tokenRes = await api.post("/admin/login", { username, password });
        const got = storeTokenIfPresent(tokenRes);
        if (got) {
          if (typeof onLogin === "function") onLogin();
          navigate("/admin/dashboard");
          return;
        }
        // If token endpoint responded with success but no token, continue to cookie fallback below.
        if (tokenRes?.data?.success) {
          if (typeof onLogin === "function") onLogin();
          navigate("/admin/dashboard");
          return;
        }
      } catch (tokenErr) {
        // token endpoint might 404 or throw — ignore and try cookie fallback
        // console.warn('Token login failed', tokenErr);
      }

      // 2) Fallback to cookie-based login endpoint (your original flow)
      const res = await api.post(
        "/admin/login-cookie",
        { username, password },
        { withCredentials: true } // cookie flow requires credentials
      );

      // If token present here, store it too (defensive)
      storeTokenIfPresent(res);

      if (res.data?.success) {
        if (typeof onLogin === "function") onLogin();
        navigate("/admin/dashboard");
      } else {
        throw new Error(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Network or server error";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Kanha Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
