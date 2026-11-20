"use client";

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addItem, removeItem, updateQuantity, setShippingMethod, removePromo, clearCart } from "@/store/slices/cartSlice";
import { applyPromoAsync } from "@/store/services/cartService";
import { setCartOpen } from "@/store/slices/uiSlice";
import { computeTotals } from "@/lib/pricing";
import { getErrorMessage } from "@/utils/toastError";
import { asyncStatus } from "@/utils/asyncStatus";
import { variantKey, variantLabel, variantPrice } from "@/lib/utils";

export function useCart() {
  const dispatch = useDispatch();
  const { items, promo, shippingMethod, promo_status } = useSelector((s) => s.cart);

  const totals = useMemo(() => computeTotals({ items, shippingMethod, promo }), [items, shippingMethod, promo]);

  /** Adds a product (card or full product) with the chosen option selections. */
  const add = useCallback(
    (product, { selections = {}, quantity = 1, openDrawer = true } = {}) => {
      if (product.inStock === false) {
        toast.error(`${product.name} is currently sold out.`);
        return;
      }
      const variant = variantLabel(product.options, selections);
      dispatch(
        addItem({
          key: variantKey(product.id, selections),
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image?.src || product.images?.[0]?.src,
          price: variantPrice(product.price, product.options, selections),
          variant,
          selections,
          quantity,
        })
      );
      toast.success("Added to your bag", {
        description: variant ? `${product.name} · ${variant}` : product.name,
        action: openDrawer ? undefined : { label: "View bag", onClick: () => dispatch(setCartOpen(true)) },
      });
      if (openDrawer) dispatch(setCartOpen(true));
    },
    [dispatch]
  );

  const remove = useCallback(
    (item) => {
      dispatch(removeItem(item.key));
      toast(`${item.name} removed`, {
        action: { label: "Undo", onClick: () => dispatch(addItem(item)) },
      });
    },
    [dispatch]
  );

  const setQuantity = useCallback((key, quantity) => dispatch(updateQuantity({ key, quantity })), [dispatch]);

  const applyPromo = useCallback(
    async (code) => {
      try {
        const res = await dispatch(applyPromoAsync({ code, subtotal: totals.subtotal })).unwrap();
        toast.success(res?.message || "Code applied");
        return true;
      } catch (err) {
        const message = getErrorMessage(err);
        if (message) toast.error(message);
        return false;
      }
    },
    [dispatch, totals.subtotal]
  );

  return {
    items,
    promo,
    shippingMethod,
    totals,
    promoLoading: promo_status === asyncStatus.LOADING,
    add,
    remove,
    setQuantity,
    applyPromo,
    removePromo: () => dispatch(removePromo()),
    setShipping: (id) => dispatch(setShippingMethod(id)),
    clear: () => dispatch(clearCart()),
    openCart: () => dispatch(setCartOpen(true)),
  };
}
