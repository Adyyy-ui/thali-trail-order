import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantityStepperProps {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "md";
}

export function QuantityStepper({
  qty,
  onIncrement,
  onDecrement,
  size = "sm",
}: QuantityStepperProps) {
  const btn =
    size === "sm" ? "h-8 w-8 rounded-full" : "h-10 w-10 rounded-full";
  const label = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        aria-label="Decrease quantity"
        className={`${btn} border-gold/40 bg-transparent p-0 text-gold hover:bg-gold/15 hover:text-gold`}
        onClick={onDecrement}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span
        aria-label="Quantity"
        className={`${label} min-w-7 text-center font-semibold text-gold`}
      >
        {qty}
      </span>
      <Button
        type="button"
        aria-label="Increase quantity"
        className={`${btn} bg-gold p-0 text-primary-foreground shadow-[0_2px_12px_-2px_color-mix(in_oklab,var(--gold)_50%,transparent)] hover:bg-gold-soft`}
        onClick={onIncrement}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
