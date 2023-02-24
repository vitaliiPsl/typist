import { apiSlice } from '../../api'

export const userApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUserById: builder.query({
			query: (userId) => `/users/${userId}`,
		}),
	}),
})

export const { useGetUserByIdQuery, useLazyGetUserByIdQuery } = userApiSlice
