import { Truck } from "lucide-react";
import { commerce } from "@/config/brand";
import { formatPrice } from "@/lib/utils";

export default function FreeShippingProgress({ remaining }) {
  const pct = Math.min(100, ((commerce.freeShippingThreshold - remaining) / commerce.freeShippingThreshold) * 100);
  return (
    <div className="rounded-xl bg-sand/70 p-4">
      <p className="flex items-center gap-2 text-[13px]" aria-live="polite">
        <Truck className="size-4 text-clay" aria-hidden="true" />
        {remaining > 0 ? (
          <span>
            You are <strong className="font-semibold">{formatPrice(remaining)}</strong> away from free standard shipping.
          </span>
        ) : (
          <span className="font-semibold">Your order ships free.</span>
        )}
      </p>
      <div
        className="mt-3 h-1 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div className="h-full rounded-full bg-clay transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
