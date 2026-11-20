import { formatPrice, cn } from "@/lib/utils";

/** Presentational totals table, shared by cart, checkout and order details. */
export default function OrderTotals({ totals, promoCode, className, shippingPending = false }) {
  const rows = [
    { label: "Subtotal", value: formatPrice(totals.subtotal) },
    totals.discount > 0 && { label: `Discount${promoCode ? ` (${promoCode})` : ""}`, value: `−${formatPrice(totals.discount)}`, accent: true },
    {
      label: "Shipping",
      value: shippingPending ? "Calculated at checkout" : totals.shipping === 0 ? "Free" : formatPrice(totals.shipping),
    },
    { label: "Taxes & duties", value: "Included where applicable" },
  ].filter(Boolean);

  return (
    <dl className={cn("grid gap-3 text-[14px]", className)}>
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className={cn("text-right tabular-nums", r.accent && "text-clay")}>{r.value}</dd>
        </div>
      ))}
      <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4">
        <dt className="font-semibold">Total</dt>
        <dd className="font-display text-3xl tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
