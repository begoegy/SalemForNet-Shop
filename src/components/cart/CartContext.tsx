"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: string; qty: number };
type Ctx = {
  items: CartItem[];
  count: number;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};
const Ctx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("cart")||"[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("cart", JSON.stringify(items)); }, [items]);
  const value = useMemo(() => ({
    items,
    count: items.reduce((a,b)=>a+b.qty,0),
    add: (id: string, qty=1) => setItems(prev => {
      const found = prev.find(i=>i.id===id);
      return found ? prev.map(i=>i.id===id?{...i, qty: i.qty+qty}:i) : [...prev, {id, qty}];
    }),
    remove: (id: string) => setItems(prev => prev.filter(i=>i.id!==id)),
    setQty: (id: string, qty: number) => setItems(prev => prev.map(i=>i.id===id?{...i, qty}:i)),
    clear: () => setItems([])
  }), [items]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
