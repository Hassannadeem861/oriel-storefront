"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import { closeQuickView } from "@/store/slices/uiSlice";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductImage from "./ProductImage";
import Price from "./Price";
import Rating from "./Rating";
import VariantPicker from "./VariantPicker";
import QuantityStepper from "./QuantityStepper";
import WishlistButton from "./WishlistButton";
import { useCart } from "@/hooks/useCart";
import { ROUTES } from "@/config/navigation";
import { defaultSelections, variantPrice } from "@/lib/utils";

function QuickViewBody({ product }) {
  const dispatch = useDispatch();
  const { add } = useCart();
  const [selections, setSelections] = useState(() => defaultSelections(product.options));
  const [qty, setQty] = useState(1);
  const price = variantPrice(product.price, product.options, selections);

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <ProductImage
        src={product.image.src}
        alt={product.image.alt}
        sizes="(min-width: 768px) 420px, 90vw"
        className="aspect-[4/5] rounded-xl"
      />
      <div className="flex flex-col">
        <p className="eyebrow">{product.brand.name}</p>
        <DialogTitle className="mt-2 text-4xl">{product.name}</DialogTitle>
        <Price price={price} compareAtPrice={product.compareAtPrice} size="lg" className="mt-3" />
        <Rating value={product.rating} count={product.reviewCount} className="mt-2" />
        <DialogDescription className="mt-4 text-[15px] leading-6 text-ink-soft">{product.summary}</DialogDescription>
        <div className="mt-6">
          <VariantPicker options={product.options} selections={selections} onChange={setSelections} idPrefix="qv" />
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
          <QuantityStepper value={qty} onChange={setQty} />
          <Button
            className="flex-1"
            disabled={!product.inStock}
            onClick={() => {
              add(product, { selections, quantity: qty });
              dispatch(closeQuickView());
            }}
          >
            {product.inStock ? "Add to bag" : "Sold out"}
          </Button>
          <WishlistButton product={product} variant="outline" className="size-12 px-0" />
        </div>
        <Link
          href={ROUTES.product(product.slug)}
          onClick={() => dispatch(closeQuickView())}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold hover:text-clay"
        >
          Full details <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function QuickView() {
  const dispatch = useDispatch();
  const product = useSelector((s) => s.ui.quickView);
  // Keep the last product rendered while the dialog animates closed.
  const [last, setLast] = useState(product);
  if (product && product !== last) setLast(product);
  const shown = product || last;
  if (!shown) return null;

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && dispatch(closeQuickView())}>
      <DialogContent className="max-w-4xl p-5 md:p-8">
        <QuickViewBody key={shown.id} product={shown} />
      </DialogContent>
    </Dialog>
  );
}
