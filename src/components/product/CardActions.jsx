"use client";

import { useDispatch } from "react-redux";
import { Eye, Plus } from "lucide-react";
import { openQuickView } from "@/store/slices/uiSlice";
import { useCart } from "@/hooks/useCart";
import { defaultSelections } from "@/lib/utils";

/**
 * Hover actions on a product card. Products with options open Quick View
 * so the shopper chooses a variant; simple products add straight to the bag.
 */
export default function CardActions({ product }) {
  const dispatch = useDispatch();
  const { add } = useCart();
  const needsChoice = product.options?.some((o) => o.values.length > 1);

  const stop = (fn) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  return (
    <div className="absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-500 ease-[var(--ease-out-expo)] md:translate-y-3 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
      <button
        type="button"
        onClick={stop(() => dispatch(openQuickView(product)))}
        className="hidden h-10 flex-1 items-center justify-center gap-2 rounded-full bg-paper/90 text-[13px] font-semibold text-ink backdrop-blur transition-colors hover:bg-paper md:inline-flex"
      >
        <Eye className="size-4" aria-hidden="true" /> Quick view
        <span className="sr-only">: {product.name}</span>
      </button>
      {product.inStock && (
        <button
          type="button"
          onClick={stop(() =>
            needsChoice
              ? dispatch(openQuickView(product))
              : add(product, { selections: defaultSelections(product.options) })
          )}
          aria-label={needsChoice ? `Choose options for ${product.name}` : `Add ${product.name} to bag`}
          className="ml-auto grid size-10 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-clay"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
