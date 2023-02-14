import { apiSlice } from '../../api'

export const textApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		loadText: builder.query({
			query: (args) => ({
				url: '/api/text',
			}),
		}),
	}),
})

export const { useLoadTextQuery } = textApi
