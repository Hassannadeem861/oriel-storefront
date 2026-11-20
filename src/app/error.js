"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center py-16" role="alert">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="display mt-4 text-6xl md:text-7xl">We dropped something.</h1>
      <p className="mt-5 max-w-md text-lg text-ink-soft">
        An unexpected error stopped this page from loading. Please try again. If it keeps happening, let us know.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => reset()}>Try again</Button>
        <Button asChild size="lg" variant="outline"><Link href="/contact">Contact us</Link></Button>
      </div>
      {error?.digest && <p className="mt-6 font-mono text-[12px] text-muted-foreground">Reference: {error.digest}</p>}
    </section>
  );
}
