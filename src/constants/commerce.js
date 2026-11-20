export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

export const DEFAULT_SORT = "featured";

export const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Standard",
    description: "5 to 8 business days, tracked",
    price: 12,
  },
  {
    id: "express",
    label: "Express",
    description: "2 to 3 business days, tracked and insured",
    price: 28,
  },
];

export const ORDER_STATUS = {
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABEL = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const MAX_CART_QTY = 10;
export const RECENTLY_VIEWED_LIMIT = 8;

/** Countries offered at checkout (subset of the regions we ship to). */
export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "PK", name: "Pakistan" },
];
