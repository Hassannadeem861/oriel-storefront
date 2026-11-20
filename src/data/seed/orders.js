/** Demo order history for the demo account. All orders are simulated. */
const address = {
  firstName: "Alex",
  lastName: "Morgan",
  line1: "220 Valencia Street",
  line2: "Apt 4",
  city: "San Francisco",
  region: "CA",
  postalCode: "94103",
  country: "US",
};

export const orders = [
  {
    _id: "OR-24817",
    userId: "u_demo",
    email: "demo@oriel.store",
    status: "delivered",
    createdAt: "2026-09-04T14:22:00.000Z",
    items: [
      { productId: "p_201", slug: "field-38-automatic", name: "Field 38 Automatic", image: "/images/products/field-38-1.webp", variant: "Slate canvas", price: 460, quantity: 1 },
      { productId: "p_402", slug: "heavyweight-essential-tee", name: "Heavyweight Essential Tee", image: "/images/products/essential-tee-1.webp", variant: "Bone / M", price: 48, quantity: 2 },
    ],
    shippingMethod: "standard",
    shippingAddress: address,
    payment: { method: "card", last4: "4242", simulated: true },
    totals: { subtotal: 556, discount: 0, shipping: 0, tax: 0, total: 556 },
    timeline: [
      { status: "processing", date: "2026-09-04T14:22:00.000Z" },
      { status: "shipped", date: "2026-09-05T09:10:00.000Z" },
      { status: "delivered", date: "2026-09-10T16:45:00.000Z" },
    ],
    tracking: "DEMO-TRK-77812034",
  },
  {
    _id: "OR-25390",
    userId: "u_demo",
    email: "demo@oriel.store",
    status: "shipped",
    createdAt: "2026-11-12T08:05:00.000Z",
    items: [
      { productId: "p_501", slug: "kiln-vessel-no-3", name: "Kiln Vessel No. 3", image: "/images/products/vessel-no3-1.webp", variant: "Moss", price: 140, quantity: 1 },
      { productId: "p_507", slug: "cedar-and-smoke-candle", name: "Cedar & Smoke Candle", image: "/images/products/cedar-candle-1.webp", variant: null, price: 42, quantity: 2 },
    ],
    shippingMethod: "express",
    shippingAddress: address,
    payment: { method: "card", last4: "4242", simulated: true },
    totals: { subtotal: 224, discount: 22.4, shipping: 28, tax: 0, total: 229.6 },
    promoCode: "WELCOME10",
    timeline: [
      { status: "processing", date: "2026-11-12T08:05:00.000Z" },
      { status: "shipped", date: "2026-11-13T11:30:00.000Z" },
    ],
    tracking: "DEMO-TRK-90215577",
  },
  {
    _id: "OR-23102",
    userId: "u_demo",
    email: "demo@oriel.store",
    status: "cancelled",
    createdAt: "2026-05-20T19:40:00.000Z",
    items: [
      { productId: "p_301", slug: "daypack-20l", name: "Daypack 20L", image: "/images/products/daypack-20-1.webp", variant: "Ink", price: 185, quantity: 1 },
    ],
    shippingMethod: "standard",
    shippingAddress: address,
    payment: { method: "card", last4: "4242", simulated: true },
    totals: { subtotal: 185, discount: 0, shipping: 0, tax: 0, total: 185 },
    timeline: [
      { status: "processing", date: "2026-05-20T19:40:00.000Z" },
      { status: "cancelled", date: "2026-05-21T08:00:00.000Z" },
    ],
  },
];
