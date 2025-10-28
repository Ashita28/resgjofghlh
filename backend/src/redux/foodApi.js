// src/redux/foodApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Point directly to /api on your server
// In dev, set VITE_API_URL="http://localhost:3000/api"
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const foodApi = createApi({
  reducerPath: 'foodApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE }),
  tagTypes: ['Food'],
  endpoints: (builder) => ({
    // GET /api/foods?query...
    getFoods: builder.query({
      // accepts params object: { page, limit, q, category, inStock, minPrice, maxPrice, sort }
      query: (params = {}) => ({
        url: '/foods',
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((f) => ({ type: 'Food', id: f._id })),
              { type: 'Food', id: 'LIST' },
            ]
          : [{ type: 'Food', id: 'LIST' }],
    }),

    // POST /api/foods
    createFood: builder.mutation({
      query: (body) => ({
        url: '/foods',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Food', id: 'LIST' }],
    }),

    // PATCH /api/foods/:id
    updateFood: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/foods/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Food', id },
        { type: 'Food', id: 'LIST' },
      ],
    }),

    // DELETE /api/foods/:id
    deleteFood: builder.mutation({
      query: (id) => ({
        url: `/foods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Food', id },
        { type: 'Food', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetFoodsQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
} = foodApi;

export default foodApi;
