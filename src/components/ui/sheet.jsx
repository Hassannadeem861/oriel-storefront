"use client";

import { Dialog as SheetPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const sides = {
  right: "inset-y-0 right-0 h-full w-full sm:max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  left: "inset-y-0 left-0 h-full w-[88%] max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  top: "inset-x-0 top-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
  bottom: "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-3xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
};

function SheetContent({ className, children, side = "right", showClose = true, ...props }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-night/45 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        data-lenis-prevent
        className={cn(
          "fixed z-50 flex flex-col bg-paper shadow-2xl outline-none transition ease-[var(--ease-out-expo)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          sides[side],
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <SheetPrimitive.Close className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-ink transition hover:bg-sand">
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col gap-1 border-b border-border px-6 py-5 pr-16", className)} {...props} />
);
const SheetTitle = ({ className, ...props }) => (
  <SheetPrimitive.Title className={cn("font-display text-3xl leading-none", className)} {...props} />
);
const SheetDescription = ({ className, ...props }) => (
  <SheetPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetDescription };
