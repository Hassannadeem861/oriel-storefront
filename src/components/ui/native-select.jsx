import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Native <select>: fully accessible and ideal on touch devices. */
function NativeSelect({ className, children, ...props }) {
  return (
    <div className={cn("relative", className)}>
      <select
        className="h-12 w-full appearance-none rounded-xl border border-input bg-paper pr-10 pl-4 text-[15px] text-ink focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 aria-invalid:border-destructive"
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

export { NativeSelect };
