import { createSlice } from "@reduxjs/toolkit";

/** items: product card snapshots, newest first. */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    toggleWishlist: (s, { payload }) => {
      const exists = s.items.some((i) => i.id === payload.id);
      s.items = exists ? s.items.filter((i) => i.id !== payload.id) : [payload, ...s.items];
    },
    removeFromWishlist: (s, { payload: id }) => {
      s.items = s.items.filter((i) => i.id !== id);
    },
    clearWishlist: (s) => { s.items = []; },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
