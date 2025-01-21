import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state for orders
const initialState = {
  selectedCustomer: null, // Selected customer ID
  orderItems: [], // Items in the current order
  shapes: ["Rectangular", "Circular", "Square"], // Predefined shapes
  products: [], // Products based on the selected shape
  loading: false,
  error: null,
};

// Async thunk to fetch products based on shape using Electron API
export const fetchProductsByShape = createAsyncThunk(
  "order/fetchProductsByShape",
  async (shape: string) => {
    const products = await window.electronAPI.fetchProductsByType(shape);
    return products;
  }
);

// Async thunk to save the order
export const saveOrder = createAsyncThunk(
  "order/saveOrder",
  async (orderData: { customerId: string; products: any[] }) => {
    const response = await window.electronAPI.createOrder({
      customerId: orderData.customerId,
      products: orderData.products.map((item) => ({
        productId: item.id,
        orderQuantity: item.quantity,
      })),
    });
    return response; // You may return additional info like order ID or status
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    selectCustomer: (state, action) => {
      state.selectedCustomer = action.payload; // Customer ID
    },
    addOrderItem: (state, action) => {
      state.orderItems.push(action.payload);
    },
    removeOrderItem: (state, action) => {
      state.orderItems = state.orderItems.filter(
        (item) => item.id !== action.payload
      );
    },
    clearOrder: (state) => {
      state.selectedCustomer = null;
      state.orderItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products by shape
      .addCase(fetchProductsByShape.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByShape.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByShape.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Save order
      .addCase(saveOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveOrder.fulfilled, (state) => {
        state.loading = false;
        state.selectedCustomer = null;
        state.orderItems = [];
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { selectCustomer, addOrderItem, removeOrderItem, clearOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
