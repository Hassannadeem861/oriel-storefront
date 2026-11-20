import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import JsonLd from "@/components/common/JsonLd";
import ShopView, { ShopFallback } from "@/components/shop/ShopView";
import { getCategories, getCategoryBySlug, getProductCards } from "@/lib/catalog";
import { applyFilters } from "@/lib/catalog-query";
import { buildMetadata, itemListLd } from "@/lib/seo";
import { ROUTES } from "@/config/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.name}: ${category.tagline}`,
    description: category.description,
    path: ROUTES.category(slug),
    image: category.image,
  });
}

/** Page stays synchronous; URL data is read inside Suspense (instant navigation). */
export default function CategoryPage({ params }) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

function CategorySkeleton() {
  return (
    <div className="container-page pt-8 pb-24" role="status" aria-label="Loading category">
      <Skeleton className="mb-8 h-4 w-48" />
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-6"><Skeleton className="h-3 w-40" /><Skeleton className="h-20 w-3/4" /><Skeleton className="h-16 w-full" /></div>
        <Skeleton className="aspect-[16/9] rounded-3xl lg:col-span-6" />
      </div>
      <ProductGridSkeleton className="mt-16" />
    </div>
  );
}

async function CategoryContent({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const inCategory = applyFilters(await getProductCards(), { categories: [slug], sort: "featured" });

  return (
    <>
      <section className="container-page pt-8 pb-12">
        <Breadcrumbs items={[{ label: "Categories", href: ROUTES.categories }, { label: category.name }]} className="mb-8" />
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4">{category.tagline} · {category.productCount} pieces</p>
            <h1 className="display text-6xl md:text-8xl">{category.name}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">{category.description}</p>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-sand lg:col-span-6">
            <Image src={category.image} alt="" fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
      <Suspense fallback={<ShopFallback products={inCategory} />}>
        <ShopView products={inCategory} fixedCategory={slug} />
      </Suspense>
      <JsonLd data={itemListLd(inCategory, ROUTES.category(slug))} />
    </>
  );
}
