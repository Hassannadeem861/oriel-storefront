"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { toggleWishlist } from "@/store/slices/wishlistSlice";

const snapshot = (p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  price: p.price,
  compareAtPrice: p.compareAtPrice || null,
  discountPercent: p.discountPercent || 0,
  onSale: Boolean(p.onSale),
  image: p.image || p.images?.[0],
  hoverImage: p.hoverImage || p.images?.[1] || null,
  category: p.category,
  brand: p.brand,
  rating: p.rating,
  reviewCount: p.reviewCount,
  inStock: p.inStock,
  lowStock: p.lowStock,
  isNew: Boolean(p.isNew),
  options: p.options || [],
  summary: p.summary,
});

export function useWishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);

  const has = useCallback((id) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback(
    (product) => {
      const saved = items.some((i) => i.id === product.id);
      dispatch(toggleWishlist(snapshot(product)));
      if (saved) toast(`Removed ${product.name} from your wishlist`);
      else toast.success("Saved to wishlist", { description: product.name });
    },
    [dispatch, items]
  );

  return { items, has, toggle, snapshot };
}
