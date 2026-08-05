'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem } from './types';

interface AppliedPromo {
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
  promo: AppliedPromo | null;
  promoError: string | null;
  applyPromo: (code: string) => Promise<void>;
  removePromo: () => void;
  discountAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'ladiesdress_cart';
const PROMO_KEY = 'ladiesdress_promo';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const rawPromo = window.localStorage.getItem(PROMO_KEY);
      if (rawPromo) setPromo(JSON.parse(rawPromo));
    } catch {
      // localStorage indisponible (mode privé, etc.) — panier en mémoire seulement
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      if (promo) window.localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
      else window.localStorage.removeItem(PROMO_KEY);
    } catch {
      // ignore
    }
  }, [items, promo, hydrated]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  }

  function removeItem(variantId: string) {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }

  function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) return removeItem(variantId);
    setItems((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
    setPromo(null);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  // Valide réellement le code contre l'API (donc contre Supabase une fois
  // configuré) : actif, non expiré, plafond d'utilisation, montant minimum.
  async function applyPromo(code: string) {
    setPromoError(null);
    try {
      const res = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!data.valid) {
        setPromoError(data.message || 'Code promo invalide.');
        setPromo(null);
        return;
      }
      setPromo({ code: code.toUpperCase(), discountType: data.discount_type, discountValue: data.discount_value });
    } catch {
      setPromoError('Impossible de vérifier le code pour le moment.');
    }
  }

  function removePromo() {
    setPromo(null);
    setPromoError(null);
  }

  const discountAmount = promo
    ? promo.discountType === 'percent'
      ? Math.round((subtotal * promo.discountValue) / 100)
      : Math.min(promo.discountValue, subtotal)
    : 0;

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, clearCart, subtotal, count,
        promo, promoError, applyPromo, removePromo, discountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
