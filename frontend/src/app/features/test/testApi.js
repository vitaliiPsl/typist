import { apiSlice } from '../../api'

export const testApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		saveTest: builder.mutation({
			query: (testResult) => ({
				url: '/tests',
				method: 'post',
				body: testResult,
			}),
		}),
		getTestByUserId: builder.query({
			query: (userId) => `/tests?userId=${userId}`,
		}),
	}),
})

export const { useSaveTestMutation, useGetTestByUserIdQuery } = testApi
