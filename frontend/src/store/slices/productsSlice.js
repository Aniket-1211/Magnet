import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { getAllProducts } from "../../services/api";

const initialState = {
  items: [],
  status: "idle",
  error: "",
  currentPage: 1,
  itemsPerPage: 12
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (token, { rejectWithValue }) => {
    try {
      const response = await getAllProducts(token);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load products");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.currentPage = 1;
        state.error = "";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load products";
      });
  }
});

export const { setCurrentPage } = productsSlice.actions;
export const selectProductsState = (state) => state.products;
export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsCurrentPage = (state) => state.products.currentPage;
export const selectProductsItemsPerPage = (state) => state.products.itemsPerPage;
export const selectProductsTotalPages = createSelector(
  [selectProducts, selectProductsItemsPerPage],
  (items, itemsPerPage) => Math.max(1, Math.ceil(items.length / itemsPerPage))
);
export const selectPaginatedProducts = createSelector(
  [selectProducts, selectProductsCurrentPage, selectProductsItemsPerPage],
  (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }
);
export default productsSlice.reducer;
