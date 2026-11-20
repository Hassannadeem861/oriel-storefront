"use client";

import Link from "next/link";
import { ShoppingBag, Lock } from "lucide-react";
import CartLineItem from "./CartLineItem";
import OrderTotals from "./OrderTotals";
import PromoCodeForm from "./PromoCodeForm";
import FreeShippingProgress from "./FreeShippingProgress";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { useHydrated } from "@/hooks/useHydrated";
import { ROUTES } from "@/config/navigation";

export default function CartView() {
  const hydrated = useHydrated();
  const { items, totals, promo, clear } = useCart();

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-12" role="status" aria-label="Loading your bag">
        <div className="space-y-6 lg:col-span-7">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-80 rounded-3xl lg:col-span-5" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Items you add will stay here, even if you close the browser."
        action={{ label: "Start shopping", href: ROUTES.shop }}
      />
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7" aria-labelledby="bag-items">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 id="bag-items" className="text-[15px] font-semibold">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
          </h2>
          <button type="button" onClick={clear} className="text-[13px] text-muted-foreground underline-offset-4 hover:text-ink hover:underline">
            Remove all
          </button>
        </div>
        <ul className="divide-y divide-border">
          {items.map((item) => <CartLineItem key={item.key} item={item} />)}
        </ul>
      </section>

      <aside className="rounded-3xl bg-paper p-6 md:p-8 lg:sticky lg:top-28 lg:col-span-5" aria-labelledby="summary-title">
        <h2 id="summary-title" className="font-display text-3xl">Order summary</h2>
        <div className="mt-6">
          <FreeShippingProgress remaining={totals.remainingForFreeShipping} />
        </div>
        <div className="mt-6"><PromoCodeForm /></div>
        <OrderTotals totals={totals} promoCode={promo?.code} className="mt-6" />
        <Button asChild variant="accent" size="lg" className="mt-6 w-full">
          <Link href={ROUTES.checkout}><Lock aria-hidden="true" /> Continue to checkout</Link>
        </Button>
        <p className="mt-4 text-center text-[12px] text-muted-foreground">
          Try code <span className="font-mono text-ink">WELCOME10</span> for 10% off. Demo store: no payment is taken.
        </p>
      </aside>
    </div>
  );
}
