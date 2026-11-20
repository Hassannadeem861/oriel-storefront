"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_CART_QTY } from "@/constants/commerce";
import { cn } from "@/lib/utils";

export default function QuantityStepper({ value, onChange, max = MAX_CART_QTY, size = "md", label = "Quantity", className }) {
  const btn = size === "sm" ? "size-8" : "size-11";
  return (
    <div className={cn("inline-flex items-center rounded-full border border-ink/15", className)} role="group" aria-label={label}>
      <button
        type="button"
        className={cn("grid place-items-center rounded-full transition-colors hover:bg-sand disabled:opacity-30", btn)}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <output className={cn("min-w-7 text-center font-mono tabular-nums", size === "sm" ? "text-[13px]" : "text-sm")} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={cn("grid place-items-center rounded-full transition-colors hover:bg-sand disabled:opacity-30", btn)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
