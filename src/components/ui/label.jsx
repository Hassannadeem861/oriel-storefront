"use client";

import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("text-[13px] font-semibold text-ink select-none peer-disabled:opacity-50", className)}
      {...props}
    />
  );
}

export { Label };
