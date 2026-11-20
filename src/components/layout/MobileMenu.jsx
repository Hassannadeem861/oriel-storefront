"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight, Heart, User } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { primaryNav, ROUTES } from "@/config/navigation";
import { brand } from "@/config/brand";
import { LogoMark } from "@/components/common/Logo";

export default function MobileMenu({ categories }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Close when the route changes (state adjusted during render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-full text-ink hover:bg-sand lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="size-5" />
      </button>
      <SheetContent side="left" className="bg-bone">
        <div className="flex items-center gap-2 px-6 pt-6">
          <LogoMark />
          <SheetTitle className="text-2xl">{brand.name}</SheetTitle>
        </div>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-8">
          <p className="eyebrow mb-3">Categories</p>
          <ul className="mb-10">
            {categories.map((c, i) => (
              <li key={c.slug} className="border-b border-line">
                <Link
                  href={ROUTES.category(c.slug)}
                  className="flex items-center justify-between py-3.5"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span className="font-display text-[32px] leading-none">{c.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{c.productCount}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="grid gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center justify-between rounded-xl py-2.5 text-[15px] font-medium">
                  {item.label} <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
          <Link href={ROUTES.account} className="flex h-12 items-center justify-center gap-2 rounded-full bg-paper text-sm font-semibold">
            <User className="size-4" aria-hidden="true" /> Account
          </Link>
          <Link href={ROUTES.wishlist} className="flex h-12 items-center justify-center gap-2 rounded-full bg-paper text-sm font-semibold">
            <Heart className="size-4" aria-hidden="true" /> Wishlist
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
