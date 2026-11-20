import PageHeader from "@/components/common/PageHeader";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { buildMetadata } from "@/lib/seo";
import { ROUTES } from "@/config/navigation";

export const metadata = buildMetadata({ title: "Checkout", path: "/checkout", noIndex: true });

export default function CheckoutPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Bag", href: ROUTES.cart }, { label: "Checkout" }]} title="Checkout" />
      <div className="container-page pb-24">
        <CheckoutForm />
      </div>
    </>
  );
}
