"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Logo from "@/components/common/Logo";
import MobileMenu from "./MobileMenu";
import { SearchButton, CartButton, WishlistLink, AccountMenu } from "./HeaderActions";
import { primaryNav, ROUTES } from "@/config/navigation";
import { cn } from "@/lib/utils";

function CategoriesMenu({ categories }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(categories[0]?.slug);
  const wrapRef = useRef(null);
  const pathname = usePathname();
  const closeTimer = useRef(null);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => !wrapRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  const show = () => { clearTimeout(closeTimer.current); setOpen(true); };
  const hide = () => { closeTimer.current = setTimeout(() => setOpen(false), 120); };
  const current = categories.find((c) => c.slug === active) || categories[0];

  return (
    <div ref={wrapRef} onPointerEnter={show} onPointerLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="categories-panel"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-sand"
      >
        Categories
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      <div
        id="categories-panel"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-paper shadow-[0_30px_60px_-30px_rgba(22,20,15,0.25)]"
      >
        <div className="container-page grid grid-cols-12 gap-10 py-10">
          <ul className="col-span-5 grid gap-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={ROUTES.category(c.slug)}
                  onPointerEnter={() => setActive(c.slug)}
                  onFocus={() => setActive(c.slug)}
                  className="group flex items-baseline justify-between rounded-xl px-4 py-2.5 transition-colors hover:bg-sand"
                >
                  <span className="font-display text-3xl leading-none">{c.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{String(c.productCount).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
          {current && (
            <div className="col-span-7 grid grid-cols-5 gap-6">
              <div className="relative col-span-3 aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
                <Image src={current.image} alt="" fill sizes="40vw" className="object-cover" />
              </div>
              <div className="col-span-2 flex flex-col justify-end">
                <p className="eyebrow">{current.tagline}</p>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{current.description}</p>
                <Link href={ROUTES.category(current.slug)} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-clay">
                  Explore {current.name} <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader({ categories }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled ? "border-b border-border bg-bone/90 backdrop-blur-md" : "border-b border-transparent bg-bone"
      )}
    >
      <div className="container-page relative grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[72px]">
        <div className="flex items-center gap-1">
          <MobileMenu categories={categories} />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <Link
              href={ROUTES.shop}
              aria-current={pathname === ROUTES.shop ? "page" : undefined}
              className="rounded-full px-3 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-sand aria-[current=page]:text-clay"
            >
              Shop all
            </Link>
            <CategoriesMenu categories={categories} />
            {primaryNav.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="rounded-full px-3 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-sand aria-[current=page]:text-clay"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" aria-label="Home" className="justify-self-center">
          <Logo />
        </Link>

        <div className="flex items-center justify-end gap-0.5">
          <SearchButton />
          <AccountMenu className="hidden sm:grid" />
          <WishlistLink className="hidden sm:grid" />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
