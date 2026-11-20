import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderLoader, { OrderSkeleton } from "@/components/orders/OrderLoader";
import { ROUTES } from "@/config/navigation";
import { orders as seededOrders } from "@/data/seed/orders";

export const metadata = { title: "Order details" };

// Private, auth-gated page rendered client-side after the session is restored,
// so it is opted out of instant-navigation validation.
export const instant = false;

/**
 * Seeded demo orders are prerendered; orders created later (ids unknown at
 * build time) are rendered on first request. The order itself is fetched
 * client-side through the order service, which enforces ownership.
 */
export async function generateStaticParams() {
  return seededOrders.map((o) => ({ id: o._id }));
}

export default function OrderDetailsPage({ params }) {
  return (
    <div>
      <Link href={ROUTES.orders} className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:text-clay">
        <ArrowLeft className="size-4" aria-hidden="true" /> All orders
      </Link>
      <h1 className="display mt-4 mb-10 text-5xl md:text-6xl">Order details</h1>
      <Suspense fallback={<OrderSkeleton />}>
        {params.then(({ id }) => (
          <OrderLoader id={decodeURIComponent(id)} />
        ))}
      </Suspense>
    </div>
  );
}
