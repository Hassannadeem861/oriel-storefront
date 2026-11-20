export const ROUTES = {
  home: "/",
  shop: "/shop",
  categories: "/categories",
  category: (slug) => `/categories/${slug}`,
  product: (slug) => `/products/${slug}`,
  search: "/search",
  cart: "/cart",
  wishlist: "/wishlist",
  checkout: "/checkout",
  checkoutSuccess: (id) => `/checkout/success?order=${encodeURIComponent(id)}`,
  login: "/login",
  register: "/register",
  account: "/account",
  orders: "/account/orders",
  order: (id) => `/account/orders/${id}`,
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  shipping: "/shipping-policy",
  returns: "/returns",
  privacy: "/privacy-policy",
  terms: "/terms",
};

export const primaryNav = [
  { label: "Shop all", href: ROUTES.shop },
  { label: "Categories", href: ROUTES.categories },
  { label: "Our story", href: ROUTES.about },
  { label: "Help", href: ROUTES.faq },
];

export const footerNav = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: ROUTES.shop },
      { label: "Audio", href: ROUTES.category("audio") },
      { label: "Timepieces", href: ROUTES.category("timepieces") },
      { label: "Living", href: ROUTES.category("living") },
      { label: "Furniture", href: ROUTES.category("furniture") },
      { label: "On sale", href: `${ROUTES.shop}?sale=1` },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: ROUTES.faq },
      { label: "Shipping", href: ROUTES.shipping },
      { label: "Returns & refunds", href: ROUTES.returns },
      { label: "Contact us", href: ROUTES.contact },
      { label: "Track an order", href: ROUTES.orders },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Our story", href: ROUTES.about },
      { label: "Your account", href: ROUTES.account },
      { label: "Wishlist", href: ROUTES.wishlist },
    ],
  },
];

export const legalNav = [
  { label: "Privacy", href: ROUTES.privacy },
  { label: "Terms", href: ROUTES.terms },
  { label: "Shipping", href: ROUTES.shipping },
  { label: "Returns", href: ROUTES.returns },
];

export const accountNav = [
  { label: "Overview", href: ROUTES.account },
  { label: "Orders", href: ROUTES.orders },
  { label: "Wishlist", href: ROUTES.wishlist },
];
