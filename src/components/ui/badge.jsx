import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper",
        accent: "bg-clay text-white",
        outline: "border border-ink/15 text-ink",
        muted: "bg-sand text-ink-soft",
        light: "bg-paper/90 text-ink backdrop-blur",
        success: "bg-moss-tint text-moss",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
