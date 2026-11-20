"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Slider({ className, value, defaultValue, thumbLabels = [], ...props }) {
  const count = (value || defaultValue || [0]).length;
  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      className={cn("relative flex w-full touch-none items-center py-3 select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-line">
        <SliderPrimitive.Range className="absolute h-full bg-ink" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={thumbLabels[i]}
          className="block size-5 rounded-full border-2 border-ink bg-paper shadow transition hover:scale-110 focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:outline-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
