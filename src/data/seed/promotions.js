/** Demo promotions. Codes are validated by the simulated API. */
export const promoCodes = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minSubtotal: 0,
    description: "10% off your first order",
  },
  {
    code: "STUDIO25",
    type: "fixed",
    value: 25,
    minSubtotal: 200,
    description: "$25 off orders over $200",
  },
  {
    code: "FREESHIP",
    type: "shipping",
    value: 0,
    minSubtotal: 0,
    description: "Free standard shipping",
  },
];

export const announcements = [
  "Free tracked shipping over $150 to 40+ countries",
  "Use code WELCOME10 for 10% off your first order",
  "30-day returns and a 2-year warranty on everything",
];

export const featuredCampaign = {
  eyebrow: "Autumn edit",
  title: "Up to 18% off selected pieces",
  body: "A small seasonal markdown on pieces we are making room for, including the Solstice headphones, Open Heart Automatic and the Heirloom rug.",
  href: "/shop?sale=1",
  cta: "Shop the edit",
  image: "/images/editorial/terracotta-corner.webp",
};
