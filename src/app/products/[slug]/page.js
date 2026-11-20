import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import JsonLd from "@/components/common/JsonLd";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductDetails from "@/components/product/ProductDetails";
import ProductReviews from "@/components/product/ProductReviews";
import ProductRail from "@/components/product/ProductRail";
import Price from "@/components/product/Price";
import Rating from "@/components/product/Rating";
import RecentlyViewed, { TrackView } from "@/components/product/RecentlyViewed";
import GlazeLab from "@/components/home/GlazeLab";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getBrands, getProductBySlug, getProducts, getRelatedProducts, getReviewsForProduct } from "@/lib/catalog";
import { toCard } from "@/lib/catalog-query";
import { buildMetadata, productLd } from "@/lib/seo";
import { ROUTES } from "@/config/navigation";
import ProductLoading from "./loading";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: `${product.name} by ${product.brand.name}`,
    description: product.summary,
    path: ROUTES.product(slug),
    image: product.images[0].src,
  });
}

function PurchaseFallback({ product }) {
  return (
    <div aria-hidden="true">
      <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
      <Skeleton className="mt-8 h-24 w-full" />
      <Skeleton className="mt-8 h-13 w-full rounded-full" />
    </div>
  );
}

/** Page stays synchronous; URL data is read inside Suspense (instant navigation). */
export default function ProductPage({ params }) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related, brands] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product),
    getBrands(),
  ]);
  const brand = brands.find((b) => b.id === product.brandId);
  const card = toCard(product);
  const purchasable = { ...card, images: product.images, stock: product.stock };

  return (
    <>
      <div className="container-page pt-6 pb-16 md:pt-8">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: "Shop", href: ROUTES.shop },
            { label: product.category.name, href: ROUTES.category(product.category.slug) },
            { label: product.name },
          ]}
        />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={ROUTES.category(product.category.slug)} className="eyebrow hover:text-ink">{product.category.name}</Link>
                <span className="text-muted-foreground" aria-hidden="true">·</span>
                <span className="eyebrow">{product.brand.name}</span>
                {product.isNew && <Badge variant="muted">New</Badge>}
                {product.onSale && <Badge variant="accent">−{product.discountPercent}%</Badge>}
              </div>
              <h1 className="display mt-4 text-5xl md:text-6xl">{product.name}</h1>
              {product.rating && (
                <a href="#reviews" className="mt-3 inline-block">
                  <Rating value={product.rating} count={product.reviewCount} />
                </a>
              )}
              <p className="mt-5 text-[16px] leading-7 text-ink-soft">{product.summary}</p>
              <div className="mt-8">
                <Suspense fallback={<PurchaseFallback product={product} />}>
                  <ProductPurchase product={purchasable} />
                </Suspense>
              </div>
              <ProductDetails product={product} brand={brand} />
            </div>
          </div>
        </div>
      </div>

      {product.model3d === "vessel" && <GlazeLab product={card} />}

      <ProductReviews reviews={reviews} rating={product.rating} />
      <ProductRail title="You may also like" eyebrow="Related" products={related} />
      <RecentlyViewed excludeId={product.id} />
      <TrackView product={card} />
      <JsonLd data={productLd(product)} />
    </>
  );
}
