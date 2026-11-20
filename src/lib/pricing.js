import { commerce } from "@/config/brand";
import { SHIPPING_METHODS } from "@/constants/commerce";
import { roundMoney } from "./utils";

/**
 * Single pricing function used by the cart UI and the (simulated) order API,
 * so the totals a shopper sees are the totals the order records.
 */
export function computeTotals({ items = [], shippingMethod = "standard", promo = null }) {
  const subtotal = roundMoney(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  let discount = 0;
  let freeShippingPromo = false;
  if (promo && subtotal >= (promo.minSubtotal || 0)) {
    if (promo.type === "percent") discount = roundMoney((subtotal * promo.value) / 100);
    if (promo.type === "fixed") discount = Math.min(promo.value, subtotal);
    if (promo.type === "shipping") freeShippingPromo = true;
  }

  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethod) || SHIPPING_METHODS[0];
  const qualifiesFree = subtotal - discount >= commerce.freeShippingThreshold;
  let shipping = 0;
  if (itemCount > 0) {
    shipping = method.id === "standard" && (qualifiesFree || freeShippingPromo) ? 0 : method.price;
  }

  const total = roundMoney(subtotal - discount + shipping);
  const remainingForFreeShipping = Math.max(0, roundMoney(commerce.freeShippingThreshold - (subtotal - discount)));

  return { subtotal, discount, shipping, tax: 0, total, itemCount, remainingForFreeShipping };
}
