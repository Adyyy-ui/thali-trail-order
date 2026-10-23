import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { GST_RATE, formatINR } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · DineFlow" },
      {
        name: "description",
        content: "Review your DineFlow order and send it to the kitchen.",
      },
      { property: "og:title", content: "Checkout · DineFlow" },
      {
        property: "og:description",
        content: "Review your order and send it to the kitchen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const cart = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (orderId) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-surface shadow-[0_0_60px_-10px_color-mix(in_oklab,var(--gold)_50%,transparent)]">
          <BadgeCheck className="h-10 w-10 text-gold" />
        </span>
        <h1 className="mt-6 font-display text-3xl text-gold-gradient">Order Placed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order <span className="font-bold text-gold">#{orderId}</span> has been sent
          to the kitchen. Your food will arrive in about 25 minutes.
        </p>
        <p className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          A waiter will bring your dishes to Table 12. You can keep browsing the menu
          if you&apos;d like to order more.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 w-full rounded-full bg-gold font-bold text-primary-foreground hover:bg-gold-soft"
        >
          <Link to="/">Back to Menu</Link>
        </Button>
      </div>
    );
  }

  if (cart.itemCount === 0) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-3xl text-gold-gradient">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add some delicious dishes from the menu first.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 w-full rounded-full bg-gold font-bold text-primary-foreground hover:bg-gold-soft"
        >
          <Link to="/">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  const placeOrder = () => {
    if (!name.trim()) {
      setError("Please enter your name so we know who to serve.");
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError(null);
    cart.clear();
    setOrderId(String(Math.floor(1000 + Math.random() * 9000)));
  };

  return (
    <div className="min-h-dvh bg-background pb-12">
      <header className="mx-auto max-w-lg px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Menu
        </Link>
        <h1 className="mt-4 font-display text-3xl text-gold-gradient">Checkout</h1>
        <div className="gold-rule mt-5" />
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 pt-6">
        {/* Order items */}
        <section className="rounded-3xl border border-border/70 bg-card p-5">
          <h2 className="font-display text-xl text-foreground">Your Order</h2>
          <div className="mt-4 space-y-4">
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
                    {formatINR(item.price)} each
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
        </section>

        {/* Bill */}
        <section className="rounded-3xl border border-gold/25 bg-surface p-5">
          <h2 className="font-display text-xl text-gold">Bill Details</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatINR(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST ({(GST_RATE * 100).toFixed(0)}%)</span>
              <span className="text-foreground">{formatINR(cart.gst)}</span>
            </div>
            <Separator className="bg-border/60" />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-gold">{formatINR(cart.total)}</span>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="rounded-3xl border border-border/70 bg-card p-5">
          <h2 className="font-display text-xl text-foreground">Your Details</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-input bg-surface text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                className="border-input bg-surface text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Kitchen notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="e.g. less spicy, extra raita"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border-input bg-surface text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
          {error && (
            <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </section>

        <Button
          type="button"
          size="lg"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-6 text-base font-bold text-primary-foreground shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--gold)_60%,transparent)] hover:bg-gold-soft"
          onClick={placeOrder}
        >
          Place Order · {formatINR(cart.total)}
          <ChevronRight className="h-5 w-5" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Pay at the counter or via UPI when your food arrives.
        </p>
      </main>
    </div>
  );
}
