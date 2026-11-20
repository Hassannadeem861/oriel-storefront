"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chapters = [
  {
    n: "01",
    title: "Chosen slowly",
    body: "We visit the workshops, test pieces for months and turn down most of what we see. The catalog stays small on purpose.",
    image: "/images/editorial/coffee-ritual.webp",
  },
  {
    n: "02",
    title: "Built to be opened",
    body: "Headphone batteries, watch straps, sofa covers and bag hardware can all be replaced. We stock the parts for years after release.",
    image: "/images/editorial/desk-headphones.webp",
  },
  {
    n: "03",
    title: "Kept in use",
    body: "Every piece carries a two-year warranty and a repair service after that. When something wears, we would rather fix it than replace it.",
    image: "/images/editorial/calm-living.webp",
  },
];

/**
 * Scroll storytelling: on desktop the image column is pinned while chapters
 * scroll past; each chapter crossfades its image with a clip-path wipe.
 * Mobile and reduced-motion users get a simple stacked layout.
 */
export default function RepairStory() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const images = gsap.utils.toArray("[data-story-img]");
        const steps = gsap.utils.toArray("[data-story-step]");
        gsap.set(images.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        steps.forEach((step, i) => {
          if (i === 0) return;
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "top 60%",
            onEnter: () => gsap.to(images[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" }),
            onLeaveBack: () => gsap.to(images[i], { clipPath: "inset(100% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" }),
          });
        });
        steps.forEach((step) => {
          gsap.fromTo(step, { opacity: 0.25 }, {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: step, start: "top 75%", end: "top 45%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-20 md:py-28" aria-labelledby="story-title">
      <div className="container-page">
        <p className="eyebrow mb-3">How we work</p>
        <h2 id="story-title" className="display max-w-3xl text-5xl md:text-7xl">
          Fewer things, <em className="text-clay">made to be repaired.</em>
        </h2>
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand">
              {chapters.map((c, i) => (
                <Image
                  key={c.n}
                  data-story-img
                  src={c.image}
                  alt=""
                  fill
                  sizes="45vw"
                  className="object-cover"
                  style={{ zIndex: i }}
                />
              ))}
            </div>
          </div>
          <ol className="grid gap-14 lg:col-span-5 lg:col-start-8 lg:gap-0">
            {chapters.map((c) => (
              <li key={c.n} data-story-step className="flex flex-col justify-center lg:min-h-[70vh]">
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl lg:hidden">
                  <Image src={c.image} alt="" fill sizes="100vw" className="object-cover" />
                </div>
                <span className="font-mono text-[12px] text-clay">{c.n}</span>
                <h3 className="display mt-3 text-4xl md:text-5xl">{c.title}</h3>
                <p className="mt-4 max-w-md text-[16px] leading-7 text-ink-soft">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
