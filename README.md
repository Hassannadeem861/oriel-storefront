# Oriel storefront

A premium e-commerce frontend built with Next.js 16 (App Router), JavaScript,
Tailwind CSS v4, shadcn/ui, React Three Fiber, GSAP and Lenis. It runs fully on
seeded demo data with a simulated API, so it can be explored without a backend.

**Live demo:** https://oriel-storefront.vercel.app
**Repository:** https://github.com/Hassannadeem861/oriel-storefront

> **Demo mode:** checkout, payments and orders are simulated. No payment is
> processed and nothing is shipped. Reviews are sample content and labelled as such.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Copy `.env.example` to `.env.local` to set the site URL or connect a backend.

**Demo account:** `demo@oriel.store` / `demo1234` (also shown on the sign-in page).
**Promo codes:** `WELCOME10` (10% off), `STUDIO25` ($25 off over $200), `FREESHIP`.
**Test card:** `4242 4242 4242 4242`, any future expiry, any 3-digit code.

## What is included

- **21 page types:** home, shop, categories index, category, product, search,
  bag, wishlist, checkout, order confirmation, sign in, register, account,
  order history, order details, about, contact, FAQ, shipping, returns, privacy,
  terms and a custom 404, plus error and loading states.
- **Commerce interactions:** URL-driven filtering (category, maker, price range,
  sale, stock), sorting, instant search (Ctrl/Cmd + K), variants with sold-out
  states, quick view, quick add, bag drawer, quantity updates with undo, promo
  codes, free-shipping progress, wishlist, recently viewed, guest and account
  checkout, order history. Bag, wishlist and session persist in the browser.
- **3D:** procedural hero scene and the Glaze Lab, a configurator where the
  chosen glaze changes the WebGL material and is the variant added to the bag.
- **SEO:** per-page metadata, canonical URLs, Open Graph/Twitter cards, sitemap,
  robots.txt, JSON-LD for Organization, WebSite search, Product, BreadcrumbList,
  FAQPage and ItemList.
- **Accessibility:** keyboard-operable menus, dialogs and galleries, skip link,
  visible focus rings, labelled forms with inline errors, reduced-motion support,
  colour tokens chosen to meet WCAG AA contrast.

## Project docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): structure, data flow, backend integration
- [docs/BRAND.md](docs/BRAND.md): name proposals and visual identity

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run images` | Re-download and process the demo photography |
