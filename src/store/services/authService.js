import { createAsyncThunk } from "@reduxjs/toolkit";
import apiHandle from "@/utils/apiHandle";
import { typeConstants } from "@/utils/constant";

const fail = (e, msg) => e?.response?.data?.message || e?.message || msg;

export const loginAsync = createAsyncThunk(typeConstants.LOGIN, async (payload, { rejectWithValue }) => {
  try { return (await apiHandle.post("/auth/login", payload)).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to sign in")); }
});

export const registerAsync = createAsyncThunk(typeConstants.REGISTER, async (payload, { rejectWithValue }) => {
  try { return (await apiHandle.post("/auth/register", payload)).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to create account")); }
});

export const getProfileAsync = createAsyncThunk(typeConstants.GET_PROFILE, async (_, { rejectWithValue }) => {
  try { return (await apiHandle.get("/auth/me")).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to load profile")); }
});

export const updateProfileAsync = createAsyncThunk(typeConstants.UPDATE_PROFILE, async (payload, { rejectWithValue }) => {
  try { return (await apiHandle.put("/auth/update-profile", payload)).data; }
  catch (e) { return rejectWithValue(fail(e, "Failed to update profile")); }
});
