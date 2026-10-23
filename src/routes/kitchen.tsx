import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CircleDot,
  Flame,
  Monitor,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import { formatINR } from "@/data/menu";
import {
  ACTIVE_STATUSES,
  NEXT_ACTION_LABEL,
  NEXT_STATUS,
  formatOrderTime,
  minutesSince,
  updateOrderStatus,
  useNow,
  useOrders,
  type Order,
} from "@/lib/orders";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Kitchen Display · DineFlow" },
      {
        name: "description",
        content: "Live kitchen screen showing active DineFlow orders.",
      },
      { property: "og:title", content: "Kitchen Display · DineFlow" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KitchenDashboard,
});

function KitchenDashboard() {
  const { orders, loading, error } = useOrders();
  const now = useNow(15000);

  const active = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const advance = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await updateOrderStatus(order.id, next);
  };

  return (
    <div className="min-h-dvh bg-background pb-10">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--gold)_12%,transparent),transparent)]"
      />

      <header className="mx-auto max-w-7xl px-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-surface">
              <Flame className="h-6 w-6 text-gold" />
            </span>
            <div>
              <h1 className="font-display text-3xl leading-none text-gold-gradient">
                Kitchen Display
              </h1>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {active.length} Active {active.length === 1 ? "Order" : "Orders"}
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
              className="rounded-full border-border bg-transparent text-muted-foreground hover:text-gold"
            >
              <Link to="/admin">
                <Monitor className="mr-1.5 h-4 w-4" /> Admin
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
      </header>

      <main className="mx-auto max-w-7xl px-5 pt-6">
        {loading ? (
          <p className="py-24 text-center text-lg text-muted-foreground">Loading orders…</p>
        ) : error ? (
          <p className="py-24 text-center text-lg text-destructive">{error}</p>
        ) : active.length === 0 ? (
          <p className="py-24 text-center text-lg text-muted-foreground">
            No active orders. New orders pop in automatically.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {active.map((order) => (
              <KitchenOrderCard key={order.id} order={order} now={now} onAdvance={advance} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function KitchenOrderCard({
  order,
  now,
  onAdvance,
}: {
  order: Order;
  now: number;
  onAdvance: (o: Order) => Promise<void>;
}) {
  const next = NEXT_STATUS[order.status];
  const mins = minutesSince(order.createdAt, now);
  const late = mins >= 15;

  return (
    <article
      className={`flex flex-col rounded-3xl border-2 bg-card p-6 ${
        late ? "border-destructive/60" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-4xl text-gold">#DF-{order.id}</p>
          <p className="mt-1 text-sm uppercase tracking-wide text-muted-foreground">
            Table {order.tableNumber}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p
        className={`mt-3 flex items-center gap-1.5 text-sm font-semibold ${
          late ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        <Timer className="h-4 w-4" />
        {mins === 0 ? "just now" : `${mins} min ago`} · {formatOrderTime(order.createdAt)}
      </p>

      <div className="gold-rule my-4" />

      <ul className="min-h-0 flex-1 space-y-2.5">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-baseline justify-between gap-3">
            <span className="text-lg font-semibold text-foreground">
              <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-base font-bold text-gold">
                {item.qty}
              </span>
              {item.name}
            </span>
            <span className="text-sm text-muted-foreground">{formatINR(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="mt-3 rounded-xl border border-gold/30 bg-gold/5 px-3 py-2 text-sm font-semibold text-gold-soft">
          Note: {order.notes}
        </p>
      )}

      {next && (
        <Button
          type="button"
          size="lg"
          className="mt-5 w-full rounded-2xl bg-gold py-7 text-lg font-bold text-primary-foreground shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--gold)_55%,transparent)] hover:bg-gold-soft"
          onClick={() => onAdvance(order)}
        >
          {NEXT_ACTION_LABEL[order.status]}
        </Button>
      )}
    </article>
  );
}
