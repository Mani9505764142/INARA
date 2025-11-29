// src/App.jsx
import React from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import OrdersPage from "./pages/Orders.jsx";
import LoginPage from "./pages/Login.jsx";
import { useAuth } from "./hooks/useAuth";
import ProductsPage from "./pages/Products.jsx";


function Layout({ children, onLogout }) {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            INARA ADMIN
          </Typography>

        <Button
         component={Link}
           to="/orders"
           color={location.pathname.startsWith("/orders") ? "primary" : "inherit"}
        >
          ORDERS
         </Button>

         <Button
         component={Link}
          to="/products"
          color={location.pathname.startsWith("/products") ? "primary" : "inherit"}
          sx={{ ml: 1 }}
        >
          PRODUCTS
        </Button>


          <Button color="inherit" onClick={onLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
}

// PrivateRoute wrapper
function PrivateRoute({ children, token }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const { token, login, logout } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          token ? <Navigate to="/orders" replace /> : <LoginPage onLogin={login} />
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute token={token}>
            <Layout onLogout={logout}>
              <Routes>
                <Route path="/" element={<Navigate to="/orders" replace />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/products" element={<ProductsPage />} /> 
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
