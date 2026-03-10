import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { addToCart, clearMyCart, getMyCart, placeOrder, removeCartItem, updateCartItem } from "../../services/api";

const initialState = {
  cart: { items: [] },
  status: "idle",
  error: "",
  actionStatus: "idle"
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (token, { rejectWithValue }) => {
    try {
      const response = await getMyCart(token);
      return response.data || { items: [] };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load cart");
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ token, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await addToCart(token, { productId, quantity });
      return response.data || { items: [] };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add item");
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ token, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await updateCartItem(token, productId, { quantity });
      return response.data || { items: [] };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update item");
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ token, productId }, { rejectWithValue }) => {
    try {
      const response = await removeCartItem(token, productId);
      return response.data || { items: [] };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove item");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (token, { rejectWithValue }) => {
    try {
      const response = await clearMyCart(token);
      return response.data || { items: [] };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

export const placeOrderFromCart = createAsyncThunk(
  "cart/placeOrderFromCart",
  async (token, { rejectWithValue }) => {
    try {
      const response = await placeOrder(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to place order");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        state.error = "";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load cart";
      })
      .addCase(addItemToCart.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.cart = action.payload;
        state.error = "";
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to add item";
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.cart = action.payload;
        state.error = "";
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to update item";
      })
      .addCase(removeItemFromCart.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.cart = action.payload;
        state.error = "";
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to remove item";
      })
      .addCase(clearCart.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.cart = action.payload;
        state.error = "";
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to clear cart";
      })
      .addCase(placeOrderFromCart.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(placeOrderFromCart.fulfilled, (state) => {
        state.actionStatus = "succeeded";
        state.cart = { items: [] };
        state.error = "";
      })
      .addCase(placeOrderFromCart.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to place order";
      });
  }
});

export const selectCartState = (state) => state.cart;
export const selectCart = (state) => state.cart.cart;
export const selectCartItems = (state) => state.cart.cart.items;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotalAmount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
);
export const selectCartItemsCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export default cartSlice.reducer;
