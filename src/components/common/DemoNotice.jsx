import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Honest labelling for simulated features (payments, orders, sample reviews). */
export default function DemoNotice({ children, className }) {
  return (
    <p
      role="note"
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-clay/25 bg-clay-tint/60 px-4 py-3 text-[13px] leading-5 text-clay-deep",
        className
      )}
    >
      <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
