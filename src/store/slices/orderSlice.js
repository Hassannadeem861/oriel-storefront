import { createSlice } from "@reduxjs/toolkit";
import { asyncStatus } from "@/utils/asyncStatus";
import { getOrdersAsync, getOrderAsync, createOrderAsync } from "../services/orderService";

const initialPagination = { page: 1, limit: 10, total: 0, totalPages: 1 };

const initialState = {
  orders: [],
  pagination: initialPagination,
  get_status: asyncStatus.IDLE, get_error: null,
  selectedOrder: null,
  detail_status: asyncStatus.IDLE, detail_error: null,
  create_status: asyncStatus.IDLE, create_error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearSelectedOrder: (s) => { s.selectedOrder = null; s.detail_status = asyncStatus.IDLE; s.detail_error = null; },
    resetOrders: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersAsync.pending, (s) => { s.get_status = asyncStatus.LOADING; s.get_error = null; })
      .addCase(getOrdersAsync.fulfilled, (s, { payload }) => {
        s.get_status = asyncStatus.SUCCEEDED;
        s.orders = payload?.data || [];
        s.pagination = payload?.pagination || initialPagination;
      })
      .addCase(getOrdersAsync.rejected, (s, { payload }) => { s.get_status = asyncStatus.ERROR; s.get_error = payload; })

      .addCase(getOrderAsync.pending, (s) => { s.detail_status = asyncStatus.LOADING; s.detail_error = null; })
      .addCase(getOrderAsync.fulfilled, (s, { payload }) => { s.detail_status = asyncStatus.SUCCEEDED; s.selectedOrder = payload?.data || null; })
      .addCase(getOrderAsync.rejected, (s, { payload }) => { s.detail_status = asyncStatus.ERROR; s.detail_error = payload; })

      .addCase(createOrderAsync.pending, (s) => { s.create_status = asyncStatus.LOADING; s.create_error = null; })
      .addCase(createOrderAsync.fulfilled, (s, { payload }) => {
        s.create_status = asyncStatus.SUCCEEDED;
        const order = payload?.data;
        if (order) {
          s.selectedOrder = order;
          s.orders = [order, ...s.orders.filter((o) => o._id !== order._id)];
        }
      })
      .addCase(createOrderAsync.rejected, (s, { payload }) => { s.create_status = asyncStatus.ERROR; s.create_error = payload; });
  },
});

export const { clearSelectedOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
