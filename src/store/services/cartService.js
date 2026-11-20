import { createAsyncThunk } from "@reduxjs/toolkit";
import apiHandle from "@/utils/apiHandle";
import { typeConstants } from "@/utils/constant";

const fail = (e, msg) => e?.response?.data?.message || e?.message || msg;

export const applyPromoAsync = createAsyncThunk(typeConstants.APPLY_PROMO, async (payload, { rejectWithValue }) => {
  try { return (await apiHandle.post("/promo/validate", payload)).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to apply code")); }
});
