import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "@/utils/asyncStatus";
import { loginAsync, registerAsync, getProfileAsync, updateProfileAsync } from "../services/authService";

const initialState = {
  user_data: null,
  accessToken: null,
  user_auth: false,
  login_status: asyncStatus.IDLE, login_error: null,
  register_status: asyncStatus.IDLE, register_error: null,
  profile_status: asyncStatus.IDLE, profile_error: null,
  update_status: asyncStatus.IDLE, update_error: null,
};

const signIn = (s, payload) => {
  s.user_data = payload?.data?.user || null;
  s.accessToken = payload?.data?.accessToken || null;
  s.user_auth = Boolean(s.accessToken);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (s) => { s.login_status = asyncStatus.LOADING; s.login_error = null; })
      .addCase(loginAsync.fulfilled, (s, { payload }) => { s.login_status = asyncStatus.SUCCEEDED; signIn(s, payload); })
      .addCase(loginAsync.rejected, (s, { payload }) => { s.login_status = asyncStatus.ERROR; s.login_error = payload; })

      .addCase(registerAsync.pending, (s) => { s.register_status = asyncStatus.LOADING; s.register_error = null; })
      .addCase(registerAsync.fulfilled, (s, { payload }) => { s.register_status = asyncStatus.SUCCEEDED; signIn(s, payload); })
      .addCase(registerAsync.rejected, (s, { payload }) => { s.register_status = asyncStatus.ERROR; s.register_error = payload; })

      .addCase(getProfileAsync.pending, (s) => { s.profile_status = asyncStatus.LOADING; s.profile_error = null; })
      .addCase(getProfileAsync.fulfilled, (s, { payload }) => { s.profile_status = asyncStatus.SUCCEEDED; s.user_data = payload?.data || s.user_data; })
      .addCase(getProfileAsync.rejected, (s, { payload }) => { s.profile_status = asyncStatus.ERROR; s.profile_error = payload; })

      .addCase(updateProfileAsync.pending, (s) => { s.update_status = asyncStatus.LOADING; s.update_error = null; })
      .addCase(updateProfileAsync.fulfilled, (s, { payload }) => { s.update_status = asyncStatus.SUCCEEDED; s.user_data = payload?.data || s.user_data; })
      .addCase(updateProfileAsync.rejected, (s, { payload }) => { s.update_status = asyncStatus.ERROR; s.update_error = payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
