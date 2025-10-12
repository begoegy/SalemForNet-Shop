"use client";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/components/LanguageProvider";
import { CartProvider } from "@/components/cart/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
