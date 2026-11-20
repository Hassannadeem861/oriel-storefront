import PageHeader from "@/components/common/PageHeader";
import CartView from "@/components/cart/CartView";
import ProductRail from "@/components/product/ProductRail";
import { getFeaturedProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Your bag", path: "/cart", noIndex: true });

export default async function CartPage() {
  const suggestions = await getFeaturedProducts(4);
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Bag" }]} title="Your bag" />
      <div className="container-page pb-10">
        <CartView />
      </div>
      <ProductRail title="Often added" eyebrow="Before you go" products={suggestions} />
    </>
  );
}
