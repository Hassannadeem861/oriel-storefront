"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Fades/rises descendants marked [data-reveal] as they enter the viewport,
 * staggered in batches. Content is fully visible without JS or with
 * reduced motion; only elements still below the fold are pre-hidden.
 */
export default function Reveal({ children, className, as: Tag = "div", y = 28 }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils
          .toArray("[data-reveal]", ref.current)
          .filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
        if (!items.length) return;
        gsap.set(items, { autoAlpha: 0, y });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
