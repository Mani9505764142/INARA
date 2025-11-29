// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import HomeHero from "./pages/HomeHero";
import ProductList from "./pages/product";      // <-- default export from product.jsx
import ProductDetail from "./pages/productDetail";

import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import CheckoutPage from "./pages/Checkout";
import OrderSuccessPage from "./pages/OrderSuccess";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import AboutPage from "./pages/About";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";

import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import PaymentSuccess from "./pages/PaymentSuccess";


export default function App() {
  const { pathname } = useLocation();
  const hideHeaderOnHome = pathname === "/";

  return (
    <CartProvider>
      {!hideHeaderOnHome && <Header />}

      <Routes>
        <Route path="/" element={<HomeHero />} />

        {/* product listing + detail */}
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* other pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/returns" element={<ReturnPolicyPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>

      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
