import Link from "next/link";
import Image from "next/image";
import OrderTotals from "@/components/cart/OrderTotals";
import OrderStatusBadge from "./OrderStatusBadge";
import DemoNotice from "@/components/common/DemoNotice";
import { COUNTRIES, ORDER_STATUS_LABEL, SHIPPING_METHODS } from "@/constants/commerce";
import { ROUTES } from "@/config/navigation";
import { formatDate, formatPrice } from "@/lib/utils";

/** Full order breakdown shared by the confirmation and order-details pages. */
export default function OrderSummary({ order }) {
  const a = order.shippingAddress;
  const country = COUNTRIES.find((c) => c.code === a?.country)?.name || a?.country;
  const method = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <section className="lg:col-span-7" aria-labelledby="order-items">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <h2 id="order-items" className="text-[15px] font-semibold">
            Order {order._id} · {formatDate(order.createdAt)}
          </h2>
          <OrderStatusBadge status={order.status} />
        </div>
        <ul className="divide-y divide-border">
          {order.items.map((i) => (
            <li key={`${i.productId}-${i.variant}`} className="flex items-center gap-4 py-4">
              <Link href={ROUTES.product(i.slug)} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                {i.image && <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={ROUTES.product(i.slug)} className="font-semibold hover:text-clay">{i.name}</Link>
                <p className="text-[13px] text-muted-foreground">
                  {[i.variant, `Qty ${i.quantity}`].filter(Boolean).join(" · ")}
                </p>
              </div>
              <p className="tabular-nums">{formatPrice(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>

        {order.timeline?.length > 0 && (
          <div className="mt-8">
            <h3 className="eyebrow mb-4">Progress</h3>
            <ol className="relative grid gap-5 border-l border-line pl-6">
              {order.timeline.map((t) => (
                <li key={t.status} className="relative">
                  <span className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-clay ring-4 ring-bone" aria-hidden="true" />
                  <p className="text-[14px] font-semibold">{ORDER_STATUS_LABEL[t.status]}</p>
                  <p className="text-[13px] text-muted-foreground">{formatDate(t.date)}</p>
                </li>
              ))}
            </ol>
            {order.tracking && (
              <p className="mt-5 text-[13px] text-muted-foreground">
                Tracking reference (demo): <span className="font-mono text-ink">{order.tracking}</span>
              </p>
            )}
          </div>
        )}
      </section>

      <aside className="grid gap-6 rounded-3xl bg-paper p-6 md:p-8 lg:col-span-5">
        <OrderTotals totals={order.totals} promoCode={order.promoCode} />
        <dl className="grid gap-5 border-t border-border pt-6 text-[14px] sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <dt className="eyebrow mb-1.5">Delivering to</dt>
            <dd className="leading-6">
              {a?.firstName} {a?.lastName}<br />
              {a?.line1}{a?.line2 ? `, ${a.line2}` : ""}<br />
              {a?.city}{a?.region ? `, ${a.region}` : ""} {a?.postalCode}<br />
              {country}
            </dd>
          </div>
          <div>
            <dt className="eyebrow mb-1.5">Delivery</dt>
            <dd>{method?.label} · {method?.description}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1.5">Payment</dt>
            <dd>
              {order.payment?.method === "card" ? `Card ending ${order.payment.last4}` : "PayPal"}
              <span className="text-muted-foreground"> (simulated)</span>
            </dd>
          </div>
        </dl>
        <DemoNotice>Demo order: no payment was taken and nothing will be shipped.</DemoNotice>
      </aside>
    </div>
  );
}
