import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type OrderStatus =
  | "new"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: number;
  tableNumber: number;
  customerName: string;
  customerPhone: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: OrderStatus;
  paymentStatus: string;
  createdAt: string;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  cancelled: "Cancelled",
};

export const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  new: "border-gold/50 bg-gold/15 text-gold",
  accepted: "border-border bg-secondary text-secondary-foreground",
  preparing: "border-border bg-accent text-accent-foreground",
  ready: "border-success/40 bg-success/15 text-success",
  served: "border-border bg-muted text-muted-foreground",
  cancelled: "border-destructive/40 bg-destructive/15 text-destructive",
};

/** One-tap next step in the kitchen workflow, per status. */
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "served",
};

export const NEXT_ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  new: "Accept Order",
  accepted: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Served",
};

export const ACTIVE_STATUSES: OrderStatus[] = ["new", "accepted", "preparing", "ready"];

export function formatOrderTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function minutesSince(iso: string, now: number): number {
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));
}

/** Ticks every 30s so "x min ago" labels stay fresh without spamming renders. */
export function useNow(intervalMs = 30000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: Number(row["id"]),
    tableNumber: Number(row["table_number"]),
    customerName: String(row["customer_name"]),
    customerPhone: String(row["customer_phone"]),
    notes: (row["notes"] as string | null) ?? null,
    items: (row["items"] as OrderItem[]) ?? [],
    subtotal: Number(row["subtotal"]),
    gst: Number(row["gst"]),
    total: Number(row["total"]),
    status: row["status"] as OrderStatus,
    paymentStatus: String(row["payment_status"]),
    createdAt: String(row["created_at"]),
  };
}

export interface NewOrderInput {
  customerName: string;
  customerPhone: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  total: number;
}

export async function submitOrder(
  input: NewOrderInput
): Promise<{ orderId: number | null; error: string | null }> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      notes: input.notes,
      items: JSON.parse(JSON.stringify(input.items)) as Json,
      subtotal: input.subtotal,
      gst: input.gst,
      total: input.total,
      status: "new",
      payment_status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { orderId: null, error: "Could not place your order. Please try again." };
  }
  return { orderId: Number(data.id), error: null };
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<boolean> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  return !error;
}

/**
 * Loads all orders and keeps them fresh in real time via a database
 * subscription. Unique channel name per mount avoids re-subscribe errors.
 */
export function useOrders(): {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
} {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchRef = useRef<() => void>(() => {});

  const fetchOrders = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError("Could not load orders.");
    } else {
      setError(null);
      setOrders((data ?? []).map(mapOrder));
    }
    setLoading(false);
  }, []);

  fetchRef.current = () => void fetchOrders();

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const channel = supabase
      .channel(`orders-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchRef.current();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return { orders, loading, error, refresh: fetchRef.current };
}
