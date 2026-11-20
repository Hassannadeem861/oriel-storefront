import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/navigation";
import { getCategories } from "@/lib/catalog";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default async function NotFound() {
  const categories = await getCategories();
  return (
    <section className="container-page grid min-h-[70vh] items-center gap-12 py-16 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">
          This room is <em className="text-clay">empty.</em>
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink-soft">
          The page you are looking for has moved or never existed. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href={ROUTES.home}>Back to home</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href={ROUTES.shop}>Shop all products</Link></Button>
        </div>
      </div>
      <div className="flex justify-center" aria-hidden="true">
        <svg viewBox="0 0 240 300" className="w-56 text-ink md:w-72">
          <path d="M20 290V120C20 64.8 64.8 20 120 20s100 44.8 100 100v170" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M70 290V140a50 50 0 0 1 100 0v150" fill="none" stroke="var(--clay)" strokeWidth="3" strokeDasharray="6 8" />
          <line x1="0" y1="290" x2="240" y2="290" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      <nav aria-label="Popular categories" className="lg:col-span-2">
        <p className="eyebrow mb-4">Popular categories</p>
        <ul className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={ROUTES.category(c.slug)} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-[14px] hover:border-ink">
                {c.name} <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
