import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "@/utils/asyncStatus";
import { MAX_CART_QTY } from "@/constants/commerce";
import { applyPromoAsync } from "../services/cartService";

/**
 * items: [{ key, productId, slug, name, image, price, variant, selections, quantity }]
 * `key` identifies a product + option combination, so variants are separate lines.
 */
const initialState = {
  items: [],
  promo: null,
  shippingMethod: "standard",
  promo_status: asyncStatus.IDLE,
  promo_error: null,
};

const clamp = (n) => Math.max(1, Math.min(MAX_CART_QTY, Math.floor(Number(n) || 1)));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (s, { payload }) => {
      const existing = s.items.find((i) => i.key === payload.key);
      if (existing) existing.quantity = clamp(existing.quantity + (payload.quantity || 1));
      else s.items.unshift({ ...payload, quantity: clamp(payload.quantity || 1) });
    },
    updateQuantity: (s, { payload: { key, quantity } }) => {
      const item = s.items.find((i) => i.key === key);
      if (item) item.quantity = clamp(quantity);
    },
    removeItem: (s, { payload: key }) => {
      s.items = s.items.filter((i) => i.key !== key);
    },
    setShippingMethod: (s, { payload }) => { s.shippingMethod = payload; },
    removePromo: (s) => { s.promo = null; s.promo_status = asyncStatus.IDLE; s.promo_error = null; },
    clearCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyPromoAsync.pending, (s) => { s.promo_status = asyncStatus.LOADING; s.promo_error = null; })
      .addCase(applyPromoAsync.fulfilled, (s, { payload }) => { s.promo_status = asyncStatus.SUCCEEDED; s.promo = payload?.data || null; })
      .addCase(applyPromoAsync.rejected, (s, { payload }) => { s.promo_status = asyncStatus.ERROR; s.promo_error = payload; });
  },
});

export const { addItem, updateQuantity, removeItem, setShippingMethod, removePromo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
