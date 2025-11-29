// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const SHIPPING_CHARGE = 40;

  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("kanha_cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("kanha_cart_v1", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { ...product, qty }];
    });
    setOpen(true);
  };

  const removeItem = (productId) =>
    setItems((prev) => prev.filter((p) => p.id !== productId));

  const updateQty = (productId, qty) =>
    setItems((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, qty: Math.max(1, qty) } : p
      )
    );

  const clearCart = () => setItems([]);

  const getCount = () =>
    items.reduce((sum, i) => sum + (i.qty || 0), 0);

  const getSubtotal = () =>
    items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const getTotal = () => getSubtotal() + SHIPPING_CHARGE;

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getCount,
    getSubtotal,
    getTotal,
    SHIPPING_CHARGE,
    open,
    setOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
