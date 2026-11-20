"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import VariantPicker from "./VariantPicker";
import QuantityStepper from "./QuantityStepper";
import WishlistButton from "./WishlistButton";
import Price from "./Price";
import { useCart } from "@/hooks/useCart";
import { commerce } from "@/config/brand";
import { defaultSelections, formatPrice, variantPrice } from "@/lib/utils";

/** Variant selection, quantity, add to bag and a sticky mobile purchase bar. */
export default function ProductPurchase({ product }) {
  const searchParams = useSearchParams();
  const { add } = useCart();
  const [selections, setSelections] = useState(() => {
    const base = defaultSelections(product.options);
    // Allow deep links like ?glaze=moss (used by the homepage Glaze Lab).
    for (const o of product.options) {
      const v = searchParams.get(o.name.toLowerCase());
      if (v && o.values.some((x) => x.value === v && x.available !== false)) base[o.name] = v;
    }
    return base;
  });
  const [qty, setQty] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef(null);
  const price = variantPrice(product.price, product.options, selections);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleAdd = () => add(product, { selections, quantity: qty });

  return (
    <div>
      <Price price={price} compareAtPrice={product.compareAtPrice} size="lg" />
      {product.onSale && (
        <p className="mt-1 text-[13px] text-clay">You save {formatPrice(product.compareAtPrice - product.price)}</p>
      )}

      <div className="mt-8">
        <VariantPicker options={product.options} selections={selections} onChange={setSelections} idPrefix="pdp" />
      </div>

      <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} />
        <Button size="lg" className="min-w-48 flex-1" disabled={!product.inStock} onClick={handleAdd}>
          {product.inStock ? `Add to bag · ${formatPrice(price * qty)}` : "Sold out"}
        </Button>
        <WishlistButton product={product} variant="outline" className="size-13 px-0" />
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground" aria-live="polite">
        {!product.inStock
          ? "This piece is sold out. Save it to your wishlist and check back soon."
          : product.lowStock
            ? `Only ${product.stock} left in stock.`
            : "In stock, ships within 2 business days."}
      </p>

      <ul className="mt-8 grid gap-3 rounded-2xl bg-paper p-5 text-[13px]">
        <li className="flex items-center gap-3">
          <Truck className="size-4 text-clay" aria-hidden="true" />
          Free tracked shipping over {formatPrice(commerce.freeShippingThreshold)}
        </li>
        <li className="flex items-center gap-3">
          <RotateCcw className="size-4 text-clay" aria-hidden="true" />
          {commerce.returnWindowDays}-day returns, free exchanges
        </li>
        <li className="flex items-center gap-3">
          <ShieldCheck className="size-4 text-clay" aria-hidden="true" />
          {commerce.warrantyYears}-year warranty on every piece
        </li>
      </ul>

      {/* Sticky mobile bar once the main button scrolls away */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-paper/95 p-3 backdrop-blur transition-transform duration-500 md:hidden ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">{product.name}</p>
            <p className="text-[13px] text-muted-foreground">{formatPrice(price)}</p>
          </div>
          <Button disabled={!product.inStock} onClick={handleAdd} tabIndex={showBar ? 0 : -1}>
            {product.inStock ? "Add to bag" : "Sold out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
