# Architecture

Next.js 16 (App Router, Cache Components, Partial Prefetching), JavaScript only.

## Folder structure

```
src/
  app/                    Routes. Server Components by default.
  components/
    ui/                   shadcn/ui primitives (radix-ui), restyled to the brand
    layout/               Header, footer, mobile menu, providers, smooth scroll
    common/               Breadcrumbs, PageHeader, JsonLd, EmptyState, DemoNotice…
    product/              Card, grid, gallery, variant picker, purchase panel, quick view…
    shop/                 URL-driven catalog browser (ShopView) + filters
    cart/ checkout/ orders/ account/ auth/ forms/ search/ wishlist/
    home/                 Homepage sections
    three/                React Three Fiber scene + lazy/progressive loader
    motion/               GSAP scroll reveal
  config/                 brand.js, site.js, navigation.js (single sources of truth)
  constants/              Sort options, shipping methods, countries, limits
  data/
    seed/                 Raw demo data: products, categories, brands, reviews, users, orders, FAQs
    seeders/              Compose seeds into the catalog and the demo database
  hooks/                  useCart, useWishlist, useHydrated, useRequireAuth, useInView, useMediaQuery
  lib/
    catalog.js            Server-side catalog repository (swap for your API/DB)
    catalog-query.js      Pure filter/sort/search helpers shared by server and client
    pricing.js            One totals function for cart UI and order API
    seo.js                Metadata builder + JSON-LD (Organization, WebSite, Product, Breadcrumb, FAQ, ItemList)
    validation.js         Zod schemas for every form
  mock/                   Simulated backend: axios adapter, route handlers, localStorage DB
  store/                  Redux Toolkit (see below)
  utils/                  apiHandle, asyncStatus, constant (type strings), toastError
```

## Data flow

**Catalog (public, SEO-relevant)** is read on the server through `lib/catalog.js`
and rendered as static HTML. Product, category and policy pages are prerendered
at build time. Client components receive lightweight "card" projections as props.

**User state** (session, bag, wishlist, orders) lives in Redux and follows the
team's Redux guide:

```
Component ── dispatch(xAsync(params)) ──▶ store/services/xService.js ── apiHandle ──▶ API
    ▲                                                                                  │
    └── useSelector(state.x) ◀── store/slices/xSlice.js extraReducers ◀── fulfilled/rejected
```

- Thunk type strings live in `utils/constant.js` (`"domain/action"`).
- Every operation has `<op>_status` / `<op>_error` using `asyncStatus.*`.
- Components call `.unwrap()` inside `try/catch` and toast the error (Sonner).
- Persisted: `auth` (data fields only), `cart` (items, promo, shipping method),
  `wishlist`, `recent`. These are user preferences a storefront must keep across
  visits; request statuses are never persisted.

## Connecting a real backend

1. Set `NEXT_PUBLIC_API_URL`. `apiHandle` then stops using the mock adapter, and
   the same thunks call your API. Endpoints expected by the services:
   `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `PUT /auth/update-profile`,
   `GET /order/get-all`, `GET /order/get/:id`, `POST /order/create`,
   `POST /promo/validate`, `POST /contact/create`, `POST /newsletter/subscribe`.
   Responses use `{ message, data, pagination? }`; see `src/mock/handlers.js` for shapes.
2. Replace the function bodies in `lib/catalog.js` with API/database reads.
   Consider `'use cache'` + `cacheLife` + `cacheTag` for catalog reads.
3. Replace the simulated payment step in `components/checkout/CheckoutForm.jsx`
   with your provider's hosted fields or redirect. Never post raw card data to your own API.

## Rendering and performance

- Static shell everywhere; `useSearchParams` consumers are wrapped in `<Suspense>`
  with server-rendered fallbacks (the shop fallback is the full product grid).
- Dynamic `params` are awaited inside `<Suspense>` so client navigations stay instant.
- Cart drawer, search and quick view are code-split and only load on first open.
- three.js loads only when a 3D scene nears the viewport, renders only while
  visible, falls back to a photo without WebGL, and stops animating for
  `prefers-reduced-motion`.
- `useHydrated()` uses `useSyncExternalStore` with a server snapshot, so
  persisted state never causes hydration mismatches.

## Images

`scripts/fetch-images.mjs` downloads curated Unsplash photographs (Unsplash
License), crops them to 4:5, creates a detail crop and stores WebP files in
`public/images`. Photos showing other companies' trademarks were excluded or
retouched. Replace them with your own product photography before launch.
