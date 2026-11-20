import { createSlice } from "@reduxjs/toolkit";

/** Transient UI state shared across distant components (never persisted). */
const uiSlice = createSlice({
  name: "ui",
  initialState: { cartOpen: false, searchOpen: false, quickView: null },
  reducers: {
    setCartOpen: (s, { payload }) => { s.cartOpen = payload; },
    setSearchOpen: (s, { payload }) => { s.searchOpen = payload; },
    openQuickView: (s, { payload }) => { s.quickView = payload; },
    closeQuickView: (s) => { s.quickView = null; },
  },
});

export const { setCartOpen, setSearchOpen, openQuickView, closeQuickView } = uiSlice.actions;
export default uiSlice.reducer;
