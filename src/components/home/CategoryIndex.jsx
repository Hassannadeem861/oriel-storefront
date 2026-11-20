"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * Editorial category index. On pointer devices a preview image follows the
 * cursor (GSAP quickTo); on touch it becomes a swipeable card row.
 */
export default function CategoryIndex({ categories }) {
  const wrapRef = useRef(null);
  const previewRef = useRef(null);
  const moveX = useRef(null);
  const moveY = useRef(null);
  const [active, setActive] = useState(null);

  useGSAP(
    () => {
      moveX.current = gsap.quickTo(previewRef.current, "x", { duration: 0.6, ease: "power3" });
      moveY.current = gsap.quickTo(previewRef.current, "y", { duration: 0.6, ease: "power3" });
    },
    { scope: wrapRef }
  );

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    moveX.current?.(e.clientX - rect.left - 150);
    moveY.current?.(e.clientY - rect.top - 190);
  };

  return (
    <section className="py-20 md:py-28" aria-labelledby="cat-index-title">
      <div className="container-page">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="eyebrow mb-3">The index</p>
            <h2 id="cat-index-title" className="display text-5xl md:text-7xl">Seven rooms, <em className="text-clay">one standard.</em></h2>
          </div>
          <p className="max-w-sm text-[15px] leading-6 text-muted-foreground">
            Every category is edited by the same rule: would we still be glad to own it in ten years?
          </p>
        </div>

        {/* Touch / small screens: card row */}
        <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:hidden">
          {categories.map((c) => (
            <li key={c.slug} className="w-[62vw] shrink-0 snap-start">
              <Link href={ROUTES.category(c.slug)} className="block">
                <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
                  <Image src={c.image} alt="" fill sizes="62vw" className="object-cover" />
                </span>
                <span className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-3xl">{c.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{c.productCount} pieces</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pointer devices: list with cursor-following preview */}
        <div ref={wrapRef} className="relative hidden md:block" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
          <ol className="border-t border-ink/15">
            {categories.map((c, i) => (
              <li key={c.slug} className="border-b border-ink/15">
                <Link
                  href={ROUTES.category(c.slug)}
                  onPointerEnter={() => setActive(c.slug)}
                  onFocus={() => setActive(c.slug)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "group grid grid-cols-12 items-baseline gap-6 py-6 transition-colors duration-500",
                    active && active !== c.slug ? "text-ink/30" : "text-ink"
                  )}
                >
                  <span className="col-span-1 font-mono text-[12px]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="col-span-6 font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-4">
                    {c.name}
                  </span>
                  <span className="col-span-3 text-[14px] text-muted-foreground">{c.tagline}</span>
                  <span className="col-span-2 flex items-center justify-end gap-2 font-mono text-[12px]">
                    {c.productCount} pieces
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div
            ref={previewRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-10 h-[380px] w-[300px] overflow-hidden rounded-2xl shadow-2xl transition-[opacity,scale] duration-500",
              active ? "scale-100 opacity-100" : "scale-90 opacity-0"
            )}
          >
            {categories.map((c) => (
              <Image
                key={c.slug}
                src={c.image}
                alt=""
                fill
                sizes="300px"
                className={cn("object-cover transition-opacity duration-500", active === c.slug ? "opacity-100" : "opacity-0")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
