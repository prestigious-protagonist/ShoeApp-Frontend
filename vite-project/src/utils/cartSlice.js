// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    // Used during fetching or adding a new item with exact quantity
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // If the item already exists, increase the quantity
        existingItem.quantity += action.payload.quantity;
      } else {
        // Otherwise, add the new item with the given quantity
        state.items.push({ ...action.payload, quantity: action.payload.quantity });
      }
    },

    // Used to replace entire cart items from DB
    setCartItemsFromDB: (state, action) => {
      state.items = action.payload.map(item => ({
        ...item,
        quantity: item.quantity, // Ensure quantity is valid
      }));
    },

    // Used when user explicitly increases quantity via UI
    incrementItemQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      }
    },

    // Optional: for decreasing quantity via UI
    decrementItemQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // Used for manual update (e.g. from a number input)
    updateItemQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    // Remove item from the cart
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
    },

    // Update item size by id
    updateItemSize: (state, action) => {
      const { id, size } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.size = size;
      }
    }
  },
});

export const {
  addItem,
  incrementItemQuantity,
  decrementItemQuantity,
  updateItemQuantity,
  removeItem,
  clearCart,
  setCartItemsFromDB,
  updateItemSize,
} = cartSlice.actions;

export default cartSlice.reducer;
