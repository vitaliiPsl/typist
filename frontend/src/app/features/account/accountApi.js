import { apiSlice } from '../../api'

export const accountApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		updateNickname: builder.mutation({
			query: (payload) => ({
				url: '/account/nickname',
				method: 'put',
				body: payload,
			}),
		}),
	}),
})

export const {
	useUpdateNicknameMutation,
} = accountApiSlice
