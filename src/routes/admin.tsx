import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChefHat,
  CircleDot,
  Monitor,
  Phone,
  StickyNote,
  UtensilsCrossed,
} from "lucide-react";
import { formatINR } from "@/data/menu";
import {
  ACTIVE_STATUSES,
  NEXT_ACTION_LABEL,
  NEXT_STATUS,
  STATUS_LABEL,
  formatOrderTime,
  minutesSince,
  updateOrderStatus,
  useNow,
  useOrders,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard · DineFlow" },
      {
        name: "description",
        content: "Live view of all DineFlow orders with status controls.",
      },
      { property: "og:title", content: "Admin Dashboard · DineFlow" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboard,
});

const FILTERS: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "accepted", label: "Accepted" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
  { id: "served", label: "Served" },
  { id: "cancelled", label: "Cancelled" },
];

function AdminDashboard() {
  const { orders, loading, error } = useOrders();
  const now = useNow();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [busyId, setBusyId] = useState<number | null>(null);

  const advance = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setBusyId(order.id);
    await updateOrderStatus(order.id, next);
    setBusyId(null);
  };

  const cancel = async (order: Order) => {
    setBusyId(order.id);
    await updateOrderStatus(order.id, "cancelled");
    setBusyId(null);
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const countOf = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
  const activeCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

  return (
    <div className="min-h-dvh bg-background pb-12">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--gold)_10%,transparent),transparent)]"
      />

      <header className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-surface">
              <Monitor className="h-5 w-5 text-gold" />
            </span>
            <div>
              <h1 className="font-display text-2xl leading-none text-gold-gradient">
                DineFlow Admin
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Order Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-surface px-3 py-1.5 text-xs font-semibold text-gold">
              <CircleDot className="h-3 w-3 animate-pulse" /> Live
            </span>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-gold/40 bg-transparent text-gold hover:bg-gold/15 hover:text-gold"
            >
              <Link to="/kitchen">
                <ChefHat className="mr-1.5 h-4 w-4" /> Kitchen
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border bg-transparent text-muted-foreground hover:text-gold"
            >
              <Link to="/">
                <UtensilsCrossed className="mr-1.5 h-4 w-4" /> Menu
              </Link>
            </Button>
          </div>
        </div>

        <div className="gold-rule mt-5" />

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Active orders" value={activeCount} highlight />
          <StatCard label="New" value={countOf("new")} />
          <StatCard label="Preparing" value={countOf("preparing")} />
          <StatCard label="Ready" value={countOf("ready")} />
        </div>
      </header>

      {/* Filters */}
      <nav
        aria-label="Filter orders by status"
        className="sticky top-0 z-20 mt-6 border-y border-border/50 bg-background/85 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                filter === f.id
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 pt-6">
        {loading ? (
          <p className="py-16 text-center text-muted-foreground">Loading orders…</p>
        ) : error ? (
          <p className="py-16 text-center text-destructive">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No {filter === "all" ? "" : STATUS_LABEL[filter].toLowerCase()} orders right
            now. New orders appear here automatically.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((order) => (
              <AdminOrderCard
                key={order.id}
                order={order}
                busy={busyId === order.id}
                now={now}
                onAdvance={advance}
                onCancel={cancel}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight ? "border-gold/40 bg-gold/5" : "border-border/70 bg-card"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-display text-3xl ${highlight ? "text-gold" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}

function AdminOrderCard({
  order,
  busy,
  now,
  onAdvance,
  onCancel,
}: {
  order: Order;
  busy: boolean;
  now: number;
  onAdvance: (o: Order) => Promise<void>;
  onCancel: (o: Order) => Promise<void>;
}) {
  const next = NEXT_STATUS[order.status];
  const mins = minutesSince(order.createdAt, now);
  const paymentLabel =
    order.paymentStatus === "paid" ? "Paid" : "Pay at counter (pending)";

  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display text-xl text-gold">#DF-{order.id}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Table {order.tableNumber} · {formatOrderTime(order.createdAt)} ·{" "}
            {mins === 0 ? "just now" : `${mins} min ago`}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="gold-rule my-4" />

      <div className="space-y-1.5">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-foreground">
              <span className="font-bold text-gold">{item.qty}×</span> {item.name}
            </span>
            <span className="text-muted-foreground">{formatINR(item.price * item.qty)}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/5 px-3 py-2 text-sm text-gold-soft">
          <StickyNote className="mt-0.5 h-4 w-4 shrink-0" /> {order.notes}
        </p>
      )}

      <div className="gold-rule my-4" />

      <div className="text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">{order.customerName}</p>
        <p className="mt-0.5 flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" /> {order.customerPhone}
        </p>
        <div className="mt-2 space-y-0.5">
          <p>Subtotal {formatINR(order.subtotal)} · GST {formatINR(order.gst)}</p>
          <p className="text-base font-bold text-gold">Total {formatINR(order.total)}</p>
          <p>Payment: {paymentLabel}</p>
        </div>
      </div>

      {next && (
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            disabled={busy}
            className="flex-1 rounded-full bg-gold font-bold text-primary-foreground hover:bg-gold-soft"
            onClick={() => onAdvance(order)}
          >
            {busy ? "Updating…" : NEXT_ACTION_LABEL[order.status]}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            className="rounded-full border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10"
            onClick={() => onCancel(order)}
          >
            Cancel
          </Button>
        </div>
      )}
    </article>
  );
}
