import { Suspense } from "react";
import PageHeader from "@/components/common/PageHeader";
import JsonLd from "@/components/common/JsonLd";
import ShopView, { ShopFallback } from "@/components/shop/ShopView";
import { getProductCards } from "@/lib/catalog";
import { applyFilters } from "@/lib/catalog-query";
import { buildMetadata, itemListLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop all products",
  description:
    "Browse every piece in the collection: headphones, watches, bags, clothing, ceramics, lighting, furniture and desk tools. Free tracked shipping over $150.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = applyFilters(await getProductCards(), { sort: "featured" });
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Shop" }]}
        eyebrow={`${products.length} pieces · 7 categories`}
        title="The whole collection"
        description="Everything we currently stock, in one place. Filter by category, maker or price, or sort by what is newest."
      />
      <Suspense fallback={<ShopFallback products={products} />}>
        <ShopView products={products} />
      </Suspense>
      <JsonLd data={itemListLd(products, "/shop")} />
    </>
  );
}
