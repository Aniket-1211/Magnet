import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyOrders } from "../../services/api";

const initialState = {
  items: [],
  status: "idle",
  error: ""
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (token, { rejectWithValue }) => {
    try {
      const response = await getMyOrders(token);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load orders");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = "";
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load orders";
      });
  }
});

export const selectOrdersState = (state) => state.orders;
export const selectOrders = (state) => state.orders.items;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;

export default ordersSlice.reducer;
