// src/redux/orderApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

// Helper (named export) so you can still resolve a user id from env/localStorage
export const getUserId = () => {
  const ls = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
  return ls || import.meta.env.VITE_DEMO_USER_ID || null;
};

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    // POST /orders
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      // If you also list orders elsewhere, this will trigger refetch
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    // (optional) GET /orders for dashboards
    getOrders: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qs.set(k, v);
        });
        return `/orders?${qs.toString()}`;
      },
      providesTags: (result) =>
        result?.orders
          ? [
              ...result.orders.map((o) => ({ type: 'Orders', id: o._id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrdersQuery } = orderApi;

// ✅ default export so `import orderApi from './orderApi'` works
export default orderApi;
