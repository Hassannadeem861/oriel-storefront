import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "@/utils/asyncStatus";
import { sendContactAsync, subscribeNewsletterAsync } from "../services/supportService";

const initialState = {
  contact_status: asyncStatus.IDLE, contact_error: null,
  newsletter_status: asyncStatus.IDLE, newsletter_error: null,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendContactAsync.pending, (s) => { s.contact_status = asyncStatus.LOADING; s.contact_error = null; })
      .addCase(sendContactAsync.fulfilled, (s) => { s.contact_status = asyncStatus.SUCCEEDED; })
      .addCase(sendContactAsync.rejected, (s, { payload }) => { s.contact_status = asyncStatus.ERROR; s.contact_error = payload; })
      .addCase(subscribeNewsletterAsync.pending, (s) => { s.newsletter_status = asyncStatus.LOADING; s.newsletter_error = null; })
      .addCase(subscribeNewsletterAsync.fulfilled, (s) => { s.newsletter_status = asyncStatus.SUCCEEDED; })
      .addCase(subscribeNewsletterAsync.rejected, (s, { payload }) => { s.newsletter_status = asyncStatus.ERROR; s.newsletter_error = payload; });
  },
});

export default supportSlice.reducer;
