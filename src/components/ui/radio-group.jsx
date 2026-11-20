"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

function RadioGroupItem({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "peer grid size-5 shrink-0 place-items-center rounded-full border border-ink/30 bg-paper transition data-[state=checked]:border-ink focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-ink" />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
