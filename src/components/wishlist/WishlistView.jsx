"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useDispatch } from "react-redux";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useHydrated } from "@/hooks/useHydrated";
import { useCart } from "@/hooks/useCart";
import { clearWishlist } from "@/store/slices/wishlistSlice";
import { openQuickView } from "@/store/slices/uiSlice";
import { ROUTES } from "@/config/navigation";
import { defaultSelections } from "@/lib/utils";

export default function WishlistView() {
  const hydrated = useHydrated();
  const dispatch = useDispatch();
  const { items } = useWishlist();
  const { add } = useCart();

  if (!hydrated) return <ProductGridSkeleton count={4} />;
  if (!items.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Nothing saved yet"
        description="Tap the heart on any product to keep it here for later. Your wishlist is saved on this device."
        action={{ label: "Explore the shop", href: ROUTES.shop }}
      />
    );
  }

  const addAll = () => {
    const simple = items.filter((p) => p.inStock && !p.options?.some((o) => o.values.length > 1));
    simple.forEach((p) => add(p, { selections: defaultSelections(p.options), openDrawer: false }));
    const needsChoice = items.find((p) => p.inStock && p.options?.some((o) => o.values.length > 1));
    if (needsChoice) dispatch(openQuickView(needsChoice));
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[14px] text-muted-foreground">{items.length} saved {items.length === 1 ? "piece" : "pieces"}</p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => dispatch(clearWishlist())}>Clear wishlist</Button>
          <Button size="sm" onClick={addAll}><ShoppingBag aria-hidden="true" /> Add available to bag</Button>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <li key={p.id}><ProductCard product={p} /></li>
        ))}
      </ul>
    </>
  );
}
