// src/redux/services/orderApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
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
    // (optional) add patch for status updates later
  }),
});

export const { useGetOrdersQuery } = orderApi;

export default orderApi;
