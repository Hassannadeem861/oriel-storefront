import { createSlice } from "@reduxjs/toolkit";
import { RECENTLY_VIEWED_LIMIT } from "@/constants/commerce";

const recentSlice = createSlice({
  name: "recent",
  initialState: { items: [] },
  reducers: {
    trackView: (s, { payload }) => {
      s.items = [payload, ...s.items.filter((i) => i.id !== payload.id)].slice(0, RECENTLY_VIEWED_LIMIT);
    },
    clearRecent: (s) => { s.items = []; },
  },
});

export const { trackView, clearRecent } = recentSlice.actions;
export default recentSlice.reducer;
