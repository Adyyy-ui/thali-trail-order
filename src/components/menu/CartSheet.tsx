import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GST_RATE, formatINR } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const cart = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-3xl border-t border-gold/25 bg-surface px-5 pb-6"
      >
        <SheetHeader className="pb-2 text-left">
          <SheetTitle className="font-display text-2xl text-gold">
            Your Order
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} · Table 12
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {cart.lines.map(({ item, qty }) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-14 w-14 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {item.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatINR(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Remove one ${item.name}`}
                  className="h-7 w-7 rounded-full border-gold/40 bg-transparent text-gold hover:bg-gold/15"
                  onClick={() => cart.decrement(item.id)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="min-w-6 text-center text-sm font-bold text-gold">
                  {qty}
                </span>
                <Button
                  type="button"
                  size="icon"
                  aria-label={`Add one ${item.name}`}
                  className="h-7 w-7 rounded-full bg-gold text-primary-foreground hover:bg-gold-soft"
                  onClick={() => cart.add(item.id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <button
                type="button"
                aria-label={`Delete ${item.name}`}
                className="text-muted-foreground transition hover:text-destructive"
                onClick={() => cart.remove(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <Separator className="bg-border/60" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatINR(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST ({(GST_RATE * 100).toFixed(0)}%)</span>
              <span className="text-foreground">{formatINR(cart.gst)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-gold">{formatINR(cart.total)}</span>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="w-full rounded-full bg-gold text-base font-bold text-primary-foreground shadow-[0_8px_30px_-8px_color-mix(in_oklab,var(--gold)_60%,transparent)] hover:bg-gold-soft"
          >
            <Link to="/checkout">Proceed to Checkout · {formatINR(cart.total)}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
