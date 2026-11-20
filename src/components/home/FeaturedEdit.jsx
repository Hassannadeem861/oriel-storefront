import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ROUTES } from "@/config/navigation";

/**
 * Asymmetric editorial grid: one large lead product and a tighter grid,
 * instead of a uniform wall of cards.
 */
export default function FeaturedEdit({ products }) {
  const [lead, ...rest] = products;
  return (
    <section className="py-20 md:py-28" aria-labelledby="edit-title">
      <div className="container-page">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">The edit</p>
            <h2 id="edit-title" className="display text-5xl md:text-7xl">Pieces we reach for</h2>
          </div>
          <Link href={ROUTES.shop} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-clay">
            Shop all products <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-x-4 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-5" data-reveal>
            <ProductCard product={lead} sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw" />
          </div>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:col-span-6 lg:col-span-7 lg:grid-cols-3">
            {rest.slice(0, 6).map((p) => (
              <li key={p.id} data-reveal>
                <ProductCard product={p} sizes="(min-width: 1024px) 18vw, (min-width: 768px) 24vw, 46vw" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
