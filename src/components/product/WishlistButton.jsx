"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

export default function WishlistButton({ product, className, variant = "floating", withLabel = false }) {
  const hydrated = useHydrated();
  const { has, toggle } = useWishlist();
  const saved = hydrated && has(product.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-300",
        variant === "floating" &&
          "size-10 rounded-full bg-paper/85 text-ink backdrop-blur hover:scale-105 hover:bg-paper",
        variant === "outline" &&
          "h-12 rounded-full border border-ink/20 px-5 text-sm font-semibold hover:border-ink",
        className
      )}
    >
      <Heart
        className={cn("size-[18px] transition-transform duration-300", saved && "scale-110 fill-clay text-clay")}
        aria-hidden="true"
      />
      {withLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
