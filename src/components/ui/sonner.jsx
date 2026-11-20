"use client";

import { Toaster as Sonner } from "sonner";

function Toaster(props) {
  return (
    <Sonner
      position="bottom-center"
      closeButton
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !border-border !bg-paper !text-ink !shadow-xl !font-sans",
          description: "!text-muted-foreground",
          actionButton: "!bg-ink !text-paper !rounded-full !px-3",
          success: "[&_[data-icon]]:!text-success",
          error: "[&_[data-icon]]:!text-destructive",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
