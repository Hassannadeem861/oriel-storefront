import OrderHistory from "@/components/account/OrderHistory";

export const metadata = { title: "Order history" };

// Private, auth-gated page rendered client-side after the session is restored,
// so it is opted out of instant-navigation validation.
export const instant = false;

export default function OrdersPage() {
  return <OrderHistory />;
}
