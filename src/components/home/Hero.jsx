import Link from "next/link";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Lazy3D from "@/components/three/Lazy3D";
import { ROUTES } from "@/config/navigation";
import { brand, commerce } from "@/config/brand";

const facts = [
  { k: "Free shipping", v: `Over $${commerce.freeShippingThreshold}` },
  { k: "Returns", v: `${commerce.returnWindowDays} days` },
  { k: "Warranty", v: `${commerce.warrantyYears} years` },
];

/** Split hero: editorial type on the left, interactive 3D arch + vessel on the right. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="container-page grid items-center gap-8 pt-6 pb-14 lg:min-h-[calc(100dvh-110px)] lg:grid-cols-12 lg:gap-6 lg:py-10">
        <div className="relative z-10 lg:col-span-6 xl:col-span-6">
          <p className="eyebrow animate-in fade-in fill-mode-both duration-700">Edition 07 · Autumn / Winter 2026</p>
          <h1 id="hero-title" className="display mt-6 text-[clamp(3.2rem,8.6vw,7.4rem)]">
            <span className="block animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-1000 ease-[var(--ease-out-expo)]">
              Objects for a
            </span>
            <span className="block animate-in fade-in slide-in-from-bottom-6 fill-mode-both delay-100 duration-1000 ease-[var(--ease-out-expo)]">
              <em className="text-clay">considered</em> life.
            </span>
          </h1>
          <p className="mt-7 max-w-lg animate-in fade-in fill-mode-both delay-300 duration-1000 text-base leading-7 text-ink-soft md:text-lg">
            {brand.name} brings together headphones, watches, bags, ceramics and furniture from small makers who build for decades, not seasons.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 animate-in fade-in fill-mode-both delay-500 duration-1000">
            <Button asChild size="lg">
              <Link href={ROUTES.shop}>
                Shop the collection <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#glaze-lab">
                Try the Glaze Lab <ArrowDownRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            {facts.map((f) => (
              <div key={f.k}>
                <dt className="eyebrow">{f.k}</dt>
                <dd className="mt-1.5 text-[15px] font-semibold">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <Lazy3D
            className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand sm:aspect-square lg:aspect-auto lg:h-[min(76vh,760px)]"
            fallbackSrc="/images/products/vessel-no3-1.webp"
            fallbackAlt="Kiln Vessel No. 3, a wheel-thrown stoneware vessel, on a marble plinth"
            sizes="(min-width: 1024px) 48vw, 100vw"
            priority
            glaze="bone"
            archColor="#d9cbb7"
          />
          <Link
            href={ROUTES.product("kiln-vessel-no-3")}
            className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-paper/90 py-2 pr-4 pl-2 text-[13px] backdrop-blur transition hover:bg-paper"
          >
            <span className="grid size-8 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">3D</span>
            <span>
              <span className="block font-semibold">Kiln Vessel No. 3</span>
              <span className="text-muted-foreground">Wheel-thrown in Kyoto · $140</span>
            </span>
          </Link>
          <p className="absolute top-4 right-4 hidden rounded-full bg-paper/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase backdrop-blur sm:block">
            Interactive 3D
          </p>
        </div>
      </div>
    </section>
  );
}
