import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { GST_RATE, MENU_ITEMS, type MenuItem } from "@/data/menu";

export interface CartLine {
  item: MenuItem;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  gst: number;
  total: number;
  qtyOf: (itemId: string) => number;
  add: (itemId: string) => void;
  decrement: (itemId: string) => void;
  remove: (itemId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const add = useCallback((itemId: string) => {
    setQuantities((q) => ({ ...q, [itemId]: (q[itemId] ?? 0) + 1 }));
  }, []);

  const decrement = useCallback((itemId: string) => {
    setQuantities((q) => {
      const next = (q[itemId] ?? 0) - 1;
      if (next <= 0) {
        const { [itemId]: _removed, ...rest } = q;
        return rest;
      }
      return { ...q, [itemId]: next };
    });
  }, []);

  const remove = useCallback((itemId: string) => {
    setQuantities((q) => {
      const { [itemId]: _removed, ...rest } = q;
      return rest;
    });
  }, []);

  const clear = useCallback(() => setQuantities({}), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = MENU_ITEMS.filter((i) => (quantities[i.id] ?? 0) > 0).map(
      (item) => ({ item, qty: quantities[item.id] })
    );
    const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.item.price, 0);
    const gst = Math.round(subtotal * GST_RATE);
    return {
      lines,
      itemCount,
      subtotal,
      gst,
      total: subtotal + gst,
      qtyOf: (itemId: string) => quantities[itemId] ?? 0,
      add,
      decrement,
      remove,
      clear,
    };
  }, [quantities, add, decrement, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
