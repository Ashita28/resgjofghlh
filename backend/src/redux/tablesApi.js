import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const tablesApi = createApi({
  reducerPath: 'tablesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE }),
  tagTypes: ['Tables'],
  endpoints: (b) => ({
    // GET /api/tables  (server mounts at /api)
    // params: { q, minChairs, maxChairs, page, limit, sort, dir }
    getTables: b.query({
      query: (params = { sort: 'tableNum', dir: 'asc', limit: 100 }) => ({
        url: '/tables',
        params,
      }),
      providesTags: (res) =>
        res?.items
          ? [
              ...res.items.map((t) => ({ type: 'Tables', id: t._id })),
              { type: 'Tables', id: 'LIST' },
            ]
          : [{ type: 'Tables', id: 'LIST' }],
    }),

    // POST /api/tables  (single or array)
    createTables: b.mutation({
      query: (body) => ({ url: '/tables', method: 'POST', body }),
      invalidatesTags: [{ type: 'Tables', id: 'LIST' }],
    }),

    // DELETE /api/tables/:id   OR  /api/tables/dummy?byNum=12
    deleteTable: b.mutation({
      query: (arg) => {
        if (typeof arg === 'string') {
          return { url: `/tables/${arg}`, method: 'DELETE' };
        }
        const { id, byNum } = arg;
        return {
          url: `/tables/${id || 'dummy'}`,
          method: 'DELETE',
          params: byNum ? { byNum } : {},
        };
      },
      invalidatesTags: (_res, _err, arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        return [{ type: 'Tables', id }, { type: 'Tables', id: 'LIST' }];
      },
    }),
  }),
});

export const {
  useGetTablesQuery,
  useCreateTablesMutation,
  useDeleteTableMutation,
} = tablesApi;

export default tablesApi;