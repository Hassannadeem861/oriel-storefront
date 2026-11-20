import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

/** Arch mark (an oriel window) + wordmark. The wordmark reads from brand config. */
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 24 28" fill="none" aria-hidden="true" className={cn("h-7 w-6", className)}>
      <path d="M2 27V12C2 6.477 6.477 2 12 2s10 4.477 10 10v15" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8 27V14a4 4 0 0 1 8 0v13" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export default function Logo({ className }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <LogoMark />
      <span className="font-display text-[28px] leading-none tracking-tight">{brand.name}</span>
    </span>
  );
}
