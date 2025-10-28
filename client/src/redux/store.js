// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import userApi from './userApi';       // must be a default export from its slice
import productApi from './productApi'; // must be a default export from its slice
import orderApi from './orderApi';     // now a default export (fixed)

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      userApi.middleware,
      productApi.middleware,
      orderApi.middleware
    )
});

setupListeners(store.dispatch);
