import { apiSlice } from '../../api'

export const textApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		loadText: builder.query({
			query: (args) => ({
				url: `/text`,
				params: args,
			}),
		}),
	}),
})

export const { useLoadTextQuery } = textApi
