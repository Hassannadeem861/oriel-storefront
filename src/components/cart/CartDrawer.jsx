"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CartLineItem from "./CartLineItem";
import FreeShippingProgress from "./FreeShippingProgress";
import { setCartOpen } from "@/store/slices/uiSlice";
import { useCart } from "@/hooks/useCart";
import { useHydrated } from "@/hooks/useHydrated";
import { ROUTES } from "@/config/navigation";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.ui.cartOpen);
  const hydrated = useHydrated();
  const { items, totals } = useCart();
  const close = () => dispatch(setCartOpen(false));

  return (
    <Sheet open={open} onOpenChange={(o) => dispatch(setCartOpen(o))}>
      <SheetContent side="right" className="bg-bone">
        <SheetHeader>
          <SheetTitle>Your bag</SheetTitle>
          <SheetDescription>
            {totals.itemCount ? `${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"}` : "Nothing here yet"}
          </SheetDescription>
        </SheetHeader>

        {!hydrated ? (
          <div className="grid gap-4 p-6">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-28 w-22" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/3" /></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-sand">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-5 font-display text-3xl">Your bag is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">Start with something you will use every day.</p>
            <Button asChild className="mt-6" onClick={close}>
              <Link href={ROUTES.shop}>Browse the shop</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-5">
              <FreeShippingProgress remaining={totals.remainingForFreeShipping} />
            </div>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6" aria-label="Items in your bag">
              {items.map((item) => (
                <CartLineItem key={item.key} item={item} compact onNavigate={close} />
              ))}
            </ul>
            <div className="border-t border-border bg-paper p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-3xl tabular-nums">{formatPrice(totals.subtotal - totals.discount)}</span>
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">Shipping and promo codes are applied at checkout.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" onClick={close}>
                  <Link href={ROUTES.cart}>View bag</Link>
                </Button>
                <Button asChild variant="accent" onClick={close}>
                  <Link href={ROUTES.checkout}>Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
