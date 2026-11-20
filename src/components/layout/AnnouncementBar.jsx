import { announcements } from "@/data/seed/promotions";

/** Slow CSS marquee (pauses on hover; static under reduced motion). */
export default function AnnouncementBar() {
  const items = [...announcements, ...announcements]; // each half must be wider than the viewport
  return (
    <div className="overflow-hidden bg-ink text-paper" role="region" aria-label="Store announcements">
      <p className="sr-only">{announcements.join(". ")}</p>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" aria-hidden="true">
        {[0, 1].map((dup) => (
          <ul key={dup} className="flex shrink-0">
            {items.map((text, i) => (
              <li key={`${dup}-${i}`} className="flex items-center gap-10 px-5 py-2 font-mono text-[11px] tracking-[0.12em] uppercase">
                {text}
                <span className="text-clay">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
