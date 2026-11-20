import { createAsyncThunk } from "@reduxjs/toolkit";
import apiHandle from "@/utils/apiHandle";
import { typeConstants } from "@/utils/constant";

const fail = (e, msg) => e?.response?.data?.message || e?.message || msg;

export const getOrdersAsync = createAsyncThunk(typeConstants.GET_ORDERS, async (params = {}, { rejectWithValue }) => {
  try { return (await apiHandle.get("/order/get-all", { params })).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to fetch orders")); }
});

export const getOrderAsync = createAsyncThunk(typeConstants.GET_ORDER, async (id, { rejectWithValue }) => {
  try { return (await apiHandle.get(`/order/get/${encodeURIComponent(id)}`)).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to fetch order")); }
});

export const createOrderAsync = createAsyncThunk(typeConstants.CREATE_ORDER, async (payload, { rejectWithValue }) => {
  try { return (await apiHandle.post("/order/create", payload)).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to place order")); }
});
