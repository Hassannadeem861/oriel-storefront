import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { getCategories } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { ROUTES } from "@/config/navigation";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Shop by category",
  description: "Explore audio, timepieces, carry, wardrobe, living, furniture and workspace, each edited for things that last.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Categories" }]}
        eyebrow="Seven rooms"
        title="Shop by category"
        description="Each category is small and edited by hand. Start with the room you are working on."
      />
      <ul className="container-page grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-6">
        {categories.map((c, i) => (
          <li key={c.slug} className={cn(i < 2 ? "lg:col-span-3" : "lg:col-span-2")}>
            <Link href={ROUTES.category(c.slug)} className="group relative block overflow-hidden rounded-3xl bg-night text-paper">
              <div className={cn("relative", i < 2 ? "aspect-[4/3]" : "aspect-[4/5]")}>
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes={i < 2 ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 32vw, 100vw"}
                  priority={i < 2}
                  className="object-cover opacity-80 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.14em] text-paper/70 uppercase">{c.tagline}</p>
                  <h2 className="display mt-2 text-5xl">{c.name}</h2>
                  <p className="mt-1 text-[13px] text-paper/70">{c.productCount} pieces</p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper text-ink transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
