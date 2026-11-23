"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import {
  addCartItem,
  applyCartCoupon,
  clearCart as clearCartRequest,
  getCart,
  removeCartCoupon,
  removeCartItem,
  updateCartItem,
} from "@/api/cart.js";

const emptyCart = {
  _id: "",
  items: [],
  appliedCoupon: null,
  summary: { subtotal: 0, shippingCharge: 0, discountAmount: 0, total: 0, itemCount: 0 },
};

/** @type {import("react").Context<any>} */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await getCart();
      if (response.success && response.data) setCart(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) void refresh();
  }, [refresh, authLoading, isAuthenticated]);

  const mutate = useCallback(async (request) => {
    const response = await request;
    if (response.success && response.data) setCart(response.data);
    return response;
  }, []);

  const addItem = useCallback(async (productId, variantId, quantity = 1) => {
    const response = await mutate(addCartItem({ productId, variantId, quantity }));
    if (response.success) toast.success("Added to your bag");
    else toast.error(response.message ?? "Could not add item");
    return Boolean(response.success);
  }, [mutate]);

  const updateQuantity = useCallback(async (variantId, quantity) => {
    await mutate(updateCartItem(variantId, { quantity }));
  }, [mutate]);

  const removeItem = useCallback(async (variantId) => {
    const response = await mutate(removeCartItem(variantId));
    if (response.success) toast.success("Item removed");
  }, [mutate]);

  const applyCoupon = useCallback(async (code) => {
    const response = await mutate(applyCartCoupon(code));
    if (response.success) toast.success(`Coupon ${code.toUpperCase()} applied`);
    else toast.error(response.message ?? "Invalid coupon");
    return Boolean(response.success);
  }, [mutate]);

  const removeCoupon = useCallback(async () => { await mutate(removeCartCoupon()); }, [mutate]);
  const clearCart = useCallback(async () => { await mutate(clearCartRequest()); }, [mutate]);

  const value = useMemo(() => ({
    cart,
    summary: cart.summary,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
    refresh,
  }), [cart, isLoading, addItem, updateQuantity, removeItem, applyCoupon, removeCoupon, clearCart, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
