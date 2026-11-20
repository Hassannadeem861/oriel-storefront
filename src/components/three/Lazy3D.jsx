"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

// three.js + R3F are only downloaded when a scene scrolls near the viewport.
const VesselScene = dynamic(() => import("./VesselScene"), { ssr: false });

let webglSupport = null;
function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const c = document.createElement("canvas");
    webglSupport = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}
const subscribeNoop = () => () => {};

/**
 * Progressive 3D: the static photo renders first (SSR, LCP-friendly), then the
 * WebGL scene fades in once visible. Without WebGL the photo simply remains.
 */
export default function Lazy3D({ fallbackSrc, fallbackAlt, className, sizes = "50vw", priority, ...sceneProps }) {
  const [ref, nearView] = useInView({ rootMargin: "300px" });
  const [visibleRef, visible] = useInView({ rootMargin: "0px", once: false });
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const supported = useSyncExternalStore(subscribeNoop, hasWebGL, () => false);
  const onReady = useCallback(() => setTimeout(() => setReady(true), 250), []);

  const setRefs = (el) => {
    ref.current = el;
    visibleRef.current = el;
  };

  return (
    <div ref={setRefs} className={cn("relative", className)}>
      {fallbackSrc && (
        <Image
          src={fallbackSrc}
          alt={fallbackAlt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover transition-opacity duration-1000", ready ? "opacity-0" : "opacity-100")}
        />
      )}
      {supported && nearView && (
        <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <VesselScene {...sceneProps} active={visible} animate={!reduced} onReady={onReady} />
        </div>
      )}
    </div>
  );
}
