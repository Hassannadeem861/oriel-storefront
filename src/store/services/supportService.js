import { createAsyncThunk } from "@reduxjs/toolkit";
import apiHandle from "@/utils/apiHandle";
import { typeConstants } from "@/utils/constant";

const fail = (e, msg) => e?.response?.data?.message || e?.message || msg;

export const sendContactAsync = createAsyncThunk(typeConstants.SEND_CONTACT, async (payload, { rejectWithValue }) => {
  try { return (await apiHandle.post("/contact/create", payload)).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to send message")); }
});

export const subscribeNewsletterAsync = createAsyncThunk(typeConstants.SUBSCRIBE_NEWSLETTER, async (payload, { rejectWithValue }) => {
  try { return (await apiHandle.post("/newsletter/subscribe", payload)).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to subscribe")); }
});
