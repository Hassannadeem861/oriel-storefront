import { Suspense } from "react";
import CheckoutSuccess from "@/components/checkout/CheckoutSuccess";
import { OrderSkeleton } from "@/components/orders/OrderLoader";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Order confirmed", path: "/checkout/success", noIndex: true });

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page py-10 pb-24">
      <Suspense fallback={<OrderSkeleton />}>
        <CheckoutSuccess />
      </Suspense>
    </div>
  );
}
