"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Desktop: vertical thumbnails + large image with pointer-follow zoom.
 * Mobile: swipeable scroll-snap carousel with dot indicators.
 */
export default function ProductGallery({ images, name }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(null);
  const trackRef = useRef(null);
  const count = images.length;

  const go = (i) => setIndex((i + count) % count);

  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  const scrollTo = (i) => {
    trackRef.current?.scrollTo({ left: i * trackRef.current.clientWidth, behavior: "smooth" });
  };

  return (
    <section aria-label={`${name} images`} aria-roledescription="carousel">
      {/* Mobile carousel */}
      <div className="md:hidden">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((img, i) => (
            <div key={img.src} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-sand" aria-label={`${i + 1} of ${count}`} role="group">
              <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="(min-width: 768px) 1px, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/25")}
            />
          ))}
        </div>
      </div>

      {/* Desktop gallery */}
      <div className="hidden gap-4 md:grid md:grid-cols-[84px_1fr]">
        <ul className="flex flex-col gap-3" aria-label="Thumbnails">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}: ${img.alt}`}
                aria-current={i === index}
                className={cn(
                  "relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-sand ring-offset-2 ring-offset-bone transition",
                  i === index ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"
                )}
              >
                <Image src={img.src} alt="" fill sizes="(max-width: 767px) 1px, 84px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <div
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-3xl bg-sand"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onPointerLeave={() => setZoom(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
          tabIndex={0}
          aria-label="Product image. Use arrow keys to change image."
        >
          {images.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={i === index ? img.alt : ""}
              fill
              priority={i === 0}
              sizes="(max-width: 767px) 1px, (min-width: 1280px) 52vw, 60vw"
              quality={85}
              className={cn(
                "object-cover transition-[opacity,transform] duration-500",
                i === index ? "opacity-100" : "opacity-0"
              )}
              style={
                i === index && zoom
                  ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                  : undefined
              }
            />
          ))}
          {count > 1 && (
            <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <button type="button" onClick={() => go(index - 1)} aria-label="Previous image" className="grid size-10 place-items-center rounded-full bg-paper/90 hover:bg-paper">
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => go(index + 1)} aria-label="Next image" className="grid size-10 place-items-center rounded-full bg-paper/90 hover:bg-paper">
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
          <span className="absolute top-4 left-4 rounded-full bg-paper/85 px-2.5 py-1 font-mono text-[11px] tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
