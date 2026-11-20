import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { commerce } from "@/config/brand";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const wholeFormatter = new Intl.NumberFormat(commerce.locale, {
  style: "currency",
  currency: commerce.currency,
  maximumFractionDigits: 0,
});
const centsFormatter = new Intl.NumberFormat(commerce.locale, {
  style: "currency",
  currency: commerce.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "$140" for whole amounts, "$229.60" otherwise. */
export function formatPrice(value) {
  const n = Math.round((Number(value) || 0) * 100) / 100;
  return (Number.isInteger(n) ? wholeFormatter : centsFormatter).format(n);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

export const roundMoney = (n) => Math.round(n * 100) / 100;

/** Builds a stable key for a product + selected options combination. */
export function variantKey(productId, selections = {}) {
  const parts = Object.keys(selections)
    .sort()
    .map((k) => `${k}:${selections[k]}`);
  return [productId, ...parts].join("|");
}

/** Human label of selected options, e.g. "Bone / M". */
export function variantLabel(options = [], selections = {}) {
  const labels = options
    .map((o) => o.values.find((v) => v.value === selections[o.name])?.label)
    .filter(Boolean)
    .map((l) => l.replace(/\s*\(.*\)$/, ""));
  return labels.length ? labels.join(" / ") : null;
}

/** Price after option surcharges (e.g. a steel bracelet). */
export function variantPrice(basePrice, options = [], selections = {}) {
  return options.reduce((sum, o) => {
    const v = o.values.find((x) => x.value === selections[o.name]);
    return sum + (v?.priceDelta || 0);
  }, basePrice);
}

/** Default selection: first available value of each option. */
export function defaultSelections(options = []) {
  return Object.fromEntries(
    options.map((o) => [o.name, (o.values.find((v) => v.available !== false) || o.values[0]).value])
  );
}
