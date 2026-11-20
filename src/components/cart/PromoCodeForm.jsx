"use client";

import { useState } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function PromoCodeForm() {
  const { promo, applyPromo, removePromo, promoLoading } = useCart();
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  if (promo) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-dashed border-clay/40 bg-clay-tint/40 px-4 py-3 text-[13px]">
        <span className="flex items-center gap-2">
          <Tag className="size-4 text-clay" aria-hidden="true" />
          <strong className="font-mono">{promo.code}</strong>
          <span className="text-muted-foreground">{promo.description}</span>
        </span>
        <button type="button" onClick={removePromo} aria-label={`Remove code ${promo.code}`} className="grid size-7 place-items-center rounded-full hover:bg-paper">
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-[13px] font-semibold underline underline-offset-4 hover:text-clay">
        Have a promo code?
      </button>
    );
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        if (await applyPromo(code.trim())) setCode("");
      }}
    >
      <label htmlFor="promo" className="sr-only">Promo code</label>
      <input
        id="promo"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="e.g. WELCOME10"
        autoComplete="off"
        autoFocus
        className="h-11 min-w-0 flex-1 rounded-full border border-input bg-paper px-4 font-mono text-sm uppercase focus-visible:border-ink focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={promoLoading || !code.trim()}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-paper hover:bg-clay disabled:opacity-50"
      >
        {promoLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Apply
      </button>
    </form>
  );
}
