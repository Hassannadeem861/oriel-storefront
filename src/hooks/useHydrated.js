"use client";

import { useSyncExternalStore } from "react";
import { useStore } from "react-redux";
import { selectHydrated } from "@/store/store";

const serverSnapshot = () => false;

/**
 * True once persisted state (cart, wishlist, session) has been restored.
 * Uses useSyncExternalStore so React reads the server snapshot (false) while
 * hydrating ANY boundary, even ones hydrated after persistence finished.
 * This keeps server HTML and the first client render identical.
 */
export function useHydrated() {
  const store = useStore();
  return useSyncExternalStore(store.subscribe, () => selectHydrated(store.getState()), serverSnapshot);
}
