import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import Reveal from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { getBrands, getProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { brand } from "@/config/brand";
import { ROUTES } from "@/config/navigation";

export const metadata = buildMetadata({
  title: "Our story",
  description: `${brand.name} is a small, independent store for well-made everyday objects. Here is how we choose what we sell, and why.`,
  path: "/about",
  image: "/images/editorial/living-room.webp",
});

const beliefs = [
  { title: "Fewer, better", body: "We would rather sell forty pieces we believe in than four hundred we do not. Every product is used by our team for at least three months before it reaches the shop." },
  { title: "Know the maker", body: "We work directly with small workshops in Denmark, Switzerland, the United States, Japan, Portugal and South Korea, and we name them on every product page." },
  { title: "Designed for repair", body: "Replaceable batteries, straps, covers and parts. We stock spares for years and run a repair service, because the most sustainable product is the one you already own." },
];

export default async function AboutPage() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const stats = [
    { value: products.length, label: "pieces in the collection" },
    { value: brands.length, label: "independent workshops" },
    { value: "40+", label: "countries we ship to" },
    { value: brand.founded, label: "the year we started" },
  ];

  return (
    <Reveal>
      <section className="container-page pt-8 pb-16">
        <Breadcrumbs items={[{ label: "Our story" }]} className="mb-8" />
        <p className="eyebrow mb-5">Our story</p>
        <h1 className="display max-w-5xl text-6xl md:text-8xl">
          A small window onto <em className="text-clay">well-made</em> things.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-soft">
          An oriel is a bay window that projects from a wall, letting in more light and a wider view. We started {brand.name} in {brand.founded} in a London studio with a similar idea: a small, bright place to find everyday objects that are made to last.
        </p>
      </section>

      <div className="container-page">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-sand md:aspect-[21/9]" data-reveal>
          <Image src="/images/editorial/living-room.webp" alt="A calm living room with a sofa, rug and natural light" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>

      <section className="container-page py-20 md:py-28" aria-labelledby="beliefs">
        <h2 id="beliefs" className="display max-w-2xl text-5xl md:text-6xl">What we believe</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {beliefs.map((b, i) => (
            <li key={b.title} data-reveal>
              <span className="font-mono text-[12px] text-clay">0{i + 1}</span>
              <h3 className="display mt-3 text-4xl">{b.title}</h3>
              <p className="mt-4 text-[15px] leading-7 text-ink-soft">{b.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-night py-20 text-paper" aria-label="Studio in numbers">
        <dl className="container-page grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} data-reveal className="flex flex-col-reverse">
              <dt className="mt-2 text-[14px] text-paper/65">{s.label}</dt>
              <dd className="display text-6xl md:text-7xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-page py-20 md:py-28" aria-labelledby="makers">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="makers" className="display text-5xl">The makers</h2>
            <p className="mt-4 text-[15px] leading-7 text-muted-foreground">The workshops behind the collection. (Maker names in this demo are fictional.)</p>
          </div>
          <ul className="divide-y divide-border border-y border-border lg:col-span-8">
            {brands.map((b) => (
              <li key={b.id} className="grid gap-2 py-6 md:grid-cols-[1fr_1.4fr] md:gap-8" data-reveal>
                <div>
                  <h3 className="text-lg font-semibold">{b.name}</h3>
                  <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">{b.origin}</p>
                </div>
                <p className="text-[15px] leading-7 text-ink-soft">{b.story}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-paper md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-96">
            <Image src="/images/editorial/coffee-ritual.webp" alt="" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="p-8 md:p-12">
            <h2 className="display text-5xl">Start with one good thing.</h2>
            <p className="mt-4 text-ink-soft">You do not need to replace everything. Choose one object you use every day and make it a good one.</p>
            <Button asChild size="lg" className="mt-8"><Link href={ROUTES.shop}>Explore the collection <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
