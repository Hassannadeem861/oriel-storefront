"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import QuantityStepper from "@/components/product/QuantityStepper";
import { useCart } from "@/hooks/useCart";
import { ROUTES } from "@/config/navigation";
import { formatPrice, cn } from "@/lib/utils";

export default function CartLineItem({ item, compact = false, onNavigate }) {
  const { remove, setQuantity } = useCart();
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={ROUTES.product(item.slug)}
        onClick={onNavigate}
        className={cn("relative shrink-0 overflow-hidden rounded-xl bg-sand", compact ? "h-28 w-22" : "h-36 w-28")}
      >
        {item.image && <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={ROUTES.product(item.slug)} onClick={onNavigate} className="line-clamp-2 text-[15px] font-semibold hover:text-clay">
              {item.name}
            </Link>
            {item.variant && <p className="mt-1 text-[13px] text-muted-foreground">{item.variant}</p>}
          </div>
          <button
            type="button"
            onClick={() => remove(item)}
            className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-sand hover:text-ink"
            aria-label={`Remove ${item.name} from bag`}
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            onChange={(q) => setQuantity(item.key, q)}
            label={`Quantity of ${item.name}`}
          />
          <div className="text-right">
            <p className="text-[15px] font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
            {item.quantity > 1 && <p className="text-[12px] text-muted-foreground">{formatPrice(item.price)} each</p>}
          </div>
        </div>
      </div>
    </li>
  );
}
