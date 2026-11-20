"use client";

import { DropdownMenu as DM } from "radix-ui";
import { cn } from "@/lib/utils";

const DropdownMenu = DM.Root;
const DropdownMenuTrigger = DM.Trigger;

function DropdownMenuContent({ className, sideOffset = 8, ...props }) {
  return (
    <DM.Portal>
      <DM.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-52 overflow-hidden rounded-2xl border border-border bg-paper p-1.5 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </DM.Portal>
  );
}

function DropdownMenuItem({ className, ...props }) {
  return (
    <DM.Item
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink outline-none select-none data-[highlighted]:bg-sand [&_svg]:size-4 [&_svg]:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

const DropdownMenuLabel = ({ className, ...props }) => (
  <DM.Label className={cn("px-3 py-2 text-xs text-muted-foreground", className)} {...props} />
);
const DropdownMenuSeparator = ({ className, ...props }) => (
  <DM.Separator className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />
);

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator };
