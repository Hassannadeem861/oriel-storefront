import { Suspense } from "react";
import PageHeader from "@/components/common/PageHeader";
import ShopView, { ShopFallback } from "@/components/shop/ShopView";
import SearchHeading from "@/components/search/SearchHeading";
import { getProductCards } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search the full collection by product, maker, material or category.",
  path: "/search",
  noIndex: true,
});

export default async function SearchPage() {
  const products = await getProductCards();
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Search" }]} eyebrow="Search" title={<Suspense fallback="Search the collection"><SearchHeading /></Suspense>} />
      <Suspense fallback={<ShopFallback products={[]} />}>
        <ShopView products={products} emptyHint="Try a broader word like “bag”, “watch” or “ceramic”, or browse all products." />
      </Suspense>
    </>
  );
}
