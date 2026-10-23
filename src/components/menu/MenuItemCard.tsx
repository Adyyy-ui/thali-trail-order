import { Flame, Star } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import { formatINR } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "./QuantityStepper";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const qty = useCart((c) => c.qtyOf(item.id));
  const add = useCart((c) => c.add);
  const decrement = useCart((c) => c.decrement);

  return (
    <article className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          width={1024}
          height={1024}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            title={item.veg ? "Vegetarian" : "Non-vegetarian"}
            className="flex h-5 w-5 items-center justify-center rounded-sm border bg-background/80"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                item.veg ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </span>
          {item.spicy && (
            <span
              title="Spicy"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-destructive"
            >
              <Flame className="h-3 w-3" />
            </span>
          )}
          {item.signature && (
            <span
              title="Chef's signature"
              className="flex items-center gap-1 rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground"
            >
              <Star className="h-2.5 w-2.5 fill-primary-foreground" />
              Signature
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg leading-tight text-foreground">
            {item.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gold">
            {formatINR(item.price)}
          </span>
          {qty > 0 ? (
            <QuantityStepper
              qty={qty}
              onIncrement={() => add(item.id)}
              onDecrement={() => decrement(item.id)}
            />
          ) : (
            <Button
              type="button"
              className="rounded-full bg-gold px-5 font-semibold text-primary-foreground shadow-[0_4px_20px_-6px_color-mix(in_oklab,var(--gold)_60%,transparent)] transition hover:bg-gold-soft"
              onClick={() => add(item.id)}
            >
              Add +
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
