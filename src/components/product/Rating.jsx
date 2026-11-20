import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Star rating; renders nothing when there are no reviews (no invented ratings). */
export default function Rating({ value, count, className, showCount = true, size = "sm" }) {
  if (!value) return null;
  const px = size === "sm" ? "size-3" : "size-4";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(px, i <= Math.round(value) ? "fill-ink text-ink" : "fill-transparent text-ink/25")}
          />
        ))}
      </span>
      <span className="sr-only">Rated {value} out of 5 from {count} sample reviews</span>
      {showCount && (
        <span className="text-[12px] text-muted-foreground" aria-hidden="true">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
