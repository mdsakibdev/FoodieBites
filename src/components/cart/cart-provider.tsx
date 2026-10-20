"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";
import type { CartPayload } from "@/lib/types";

const EMPTY_CART: CartPayload = { items: [], count: 0, subtotal: 0 };

interface CartSnapshot {
  userId: string;
  payload: CartPayload;
}

interface CartContextValue extends CartPayload {
  ready: boolean;
  busy: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [snapshot, setSnapshot] = useState<CartSnapshot | null>(null);
  const [busy, setBusy] = useState(false);

  const userId = session?.user.id ?? null;

  // Keep the cart in sync with the signed-in user. State is only updated from
  // the async response, which keeps renders cascade-free.
  useEffect(() => {
    if (sessionPending || !userId) return;

    const controller = new AbortController();
    fetch("/api/cart", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : EMPTY_CART))
      .then((payload: CartPayload) => setSnapshot({ userId, payload }))
      .catch(() => undefined);

    return () => controller.abort();
  }, [sessionPending, userId]);

  const payload =
    userId && snapshot?.userId === userId ? snapshot.payload : EMPTY_CART;
  const loaded = Boolean(userId) && snapshot?.userId === userId;

  const mutate = useCallback(
    async (method: string, body?: unknown) => {
      if (!userId) return;
      setBusy(true);
      try {
        const response = await fetch("/api/cart", {
          method,
          headers: body ? { "content-type": "application/json" } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) return;
        const next = (await response.json()) as CartPayload;
        setSnapshot({ userId, payload: next });
      } finally {
        setBusy(false);
      }
    },
    [userId],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...payload,
      ready: !sessionPending && (!userId || loaded),
      busy,
      addItem: (productId, quantity = 1) =>
        mutate("POST", { productId, quantity }),
      updateQuantity: (productId, quantity) =>
        mutate("PATCH", { productId, quantity }),
      removeItem: (productId) => mutate("PATCH", { productId, quantity: 0 }),
      clear: () => mutate("DELETE"),
    }),
    [payload, sessionPending, userId, loaded, busy, mutate],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
