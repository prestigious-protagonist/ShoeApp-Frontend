// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItem: (state, action) => {
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex !== -1) {
        // If it exists, increase its quantity
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // If it doesn't exist, add it with the given quantity
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.items = [];
    },
    updateItemQuantity: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = action.payload.quantity;
      }
    },
  },
});

export const { addItem, removeItem, clearCart, updateItemQuantity } = cartSlice.actions;

export default cartSlice.reducer;
