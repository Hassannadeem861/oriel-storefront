import Hero from "@/components/home/Hero";
import CategoryIndex from "@/components/home/CategoryIndex";
import FeaturedEdit from "@/components/home/FeaturedEdit";
import GlazeLab from "@/components/home/GlazeLab";
import RepairStory from "@/components/home/RepairStory";
import CampaignBanner from "@/components/home/CampaignBanner";
import Principles from "@/components/home/Principles";
import ProductRail from "@/components/product/ProductRail";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import Reveal from "@/components/motion/Reveal";
import { getCategories, getFeaturedProducts, getNewArrivals, getProductBySlug } from "@/lib/catalog";
import { toCard } from "@/lib/catalog-query";
import { buildMetadata } from "@/lib/seo";
import { brand } from "@/config/brand";

export const metadata = {
  ...buildMetadata({ description: brand.description, path: "/" }),
  title: { absolute: `${brand.name} | ${brand.tagline}` },
};

export default async function HomePage() {
  const [categories, featured, newArrivals, vessel] = await Promise.all([
    getCategories(),
    getFeaturedProducts(7),
    getNewArrivals(8),
    getProductBySlug("kiln-vessel-no-3"),
  ]);

  return (
    <>
      <Hero />
      <Principles />
      <CategoryIndex categories={categories} />
      <Reveal>
        <FeaturedEdit products={featured} />
      </Reveal>
      <GlazeLab product={toCard(vessel)} />
      <RepairStory />
      <Reveal>
        <CampaignBanner />
      </Reveal>
      <ProductRail title="New this season" eyebrow="Just arrived" products={newArrivals} />
      <RecentlyViewed />
    </>
  );
}
