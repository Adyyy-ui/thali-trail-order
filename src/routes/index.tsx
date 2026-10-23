import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";
import { CATEGORIES, MENU_ITEMS, type Category } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/data/menu";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { CartSheet } from "@/components/menu/CartSheet";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DineFlow · Menu — Table 12" },
      {
        name: "description",
        content:
          "Browse the DineFlow menu, add dishes to your cart and order straight from your table.",
      },
      { property: "og:title", content: "DineFlow · Menu" },
      {
        property: "og:description",
        content: "Scan, browse and order — fine dining at your fingertips.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const cart = useCart();

  const items =
    category === "all" ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === category);

  return (
    <div className="min-h-dvh bg-background pb-28">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--gold)_12%,transparent),transparent)]"
      />

      <header className="relative mx-auto max-w-3xl px-4 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-surface">
              <UtensilsCrossed className="h-5 w-5 text-gold" />
            </span>
            <div>
              <h1 className="font-display text-2xl leading-none text-gold-gradient">
                DineFlow
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Fine Indian Dining
              </p>
            </div>
          </div>
          <span className="rounded-full border border-gold/40 bg-surface px-3.5 py-1.5 text-xs font-semibold tracking-wide text-gold">
            Table 12
          </span>
        </div>

        <div className="gold-rule mt-6" />

        <h2 className="mt-6 font-display text-3xl text-foreground sm:text-4xl">
          Today&apos;s Menu
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Fresh from the kitchen — tap a dish to add it to your order.
        </p>
      </header>

      {/* Category chips */}
      <nav
        aria-label="Menu categories"
        className="sticky top-0 z-20 mt-6 border-y border-border/50 bg-background/85 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(["all", ...CATEGORIES.map((c) => c.id)] as (Category | "all")[]).map(
            (id) => {
              const label = id === "all" ? "All" : CATEGORIES.find((c) => c.id === id)!.label;
              const active = category === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCategory(id)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "border-gold bg-gold text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold"
                  }`}
                >
                  {label}
                </button>
              );
            }
          )}
        </div>
      </nav>

      {/* Items */}
      <main className="mx-auto max-w-3xl px-4 pt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      {/* Sticky cart bar */}
      {cart.itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/25 bg-surface/95 p-3 backdrop-blur-md">
          <CartSheet>
            <Button
              size="lg"
              className="mx-auto flex w-full max-w-lg items-center justify-between rounded-full bg-gold px-5 text-base font-bold text-primary-foreground shadow-[0_8px_30px_-8px_color-mix(in_oklab,var(--gold)_65%,transparent)] hover:bg-gold-soft"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
              </span>
              <span>View Cart · {formatINR(cart.total)}</span>
            </Button>
          </CartSheet>
        </div>
      )}
    </div>
  );
}
