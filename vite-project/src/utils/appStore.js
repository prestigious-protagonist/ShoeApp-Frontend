import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Combine reducers (if you have more slices later)
const rootReducer = combineReducers({
  cart: cartReducer,
});

// Persistence config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // only persist cart slice
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'production', // Enable DevTools in development
});

// Persistor for use in your app entry point
export const persistor = persistStore(store);

export default store;
