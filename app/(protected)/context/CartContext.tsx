"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  pizzaId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

type AddItemPayload = Omit<CartItem, "quantity">;

interface CartContextType {
  cart: CartItem[];

  addToCart: (item: AddItemPayload) => void;
  removeFromCart: (pizzaId: string) => void;
  toggleCart: (item: AddItemPayload) => void;

  increaseQuantity: (pizzaId: string) => void;
  decreaseQuantity: (pizzaId: string) => void;

  isInCart: (pizzaId: string) => boolean;

  clearCart: () => void;

  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "sliceofheaven_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: AddItemPayload) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.pizzaId === item.pizzaId);
      if (exists) {
        return prev.map((p) =>
          p.pizzaId === item.pizzaId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (pizzaId: string) => {
    setCart((prev) => prev.filter((p) => p.pizzaId !== pizzaId));
  };

  const toggleCart = (item: AddItemPayload) => {
    setCart((prev) => {
      const exists = prev.some((p) => p.pizzaId === item.pizzaId);
      if (exists) return prev.filter((p) => p.pizzaId !== item.pizzaId);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (pizzaId: string) => {
    setCart((prev) =>
      prev.map((p) => (p.pizzaId === pizzaId ? { ...p, quantity: p.quantity + 1 } : p))
    );
  };

  const decreaseQuantity = (pizzaId: string) => {
    setCart((prev) =>
      prev
        .map((p) => (p.pizzaId === pizzaId ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const isInCart = (pizzaId: string) => cart.some((p) => p.pizzaId === pizzaId);

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    toggleCart,
    increaseQuantity,
    decreaseQuantity,
    isInCart,
    clearCart,
    totalItems,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
