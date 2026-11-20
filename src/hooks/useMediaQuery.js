"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Returns `serverValue` during SSR. */
export function useMediaQuery(query, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)", false);
