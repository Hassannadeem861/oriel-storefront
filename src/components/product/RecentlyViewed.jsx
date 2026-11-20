"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { trackView, clearRecent } from "@/store/slices/recentSlice";
import { useHydrated } from "@/hooks/useHydrated";
import ProductRail from "./ProductRail";

/** Records a product view (rendered on product pages). */
export function TrackView({ product }) {
  const dispatch = useDispatch();
  const hydrated = useHydrated();
  useEffect(() => {
    if (hydrated) dispatch(trackView(product));
  }, [dispatch, hydrated, product]);
  return null;
}

export default function RecentlyViewed({ excludeId, title = "Recently viewed" }) {
  const dispatch = useDispatch();
  const hydrated = useHydrated();
  const items = useSelector((s) => s.recent.items).filter((p) => p.id !== excludeId);
  if (!hydrated || !items.length) return null;

  return (
    <ProductRail
      title={title}
      eyebrow="Your history"
      products={items}
      action={
        <button type="button" onClick={() => dispatch(clearRecent())} className="text-sm text-muted-foreground underline-offset-4 hover:text-ink hover:underline">
          Clear history
        </button>
      }
    />
  );
}
