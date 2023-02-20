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
		getTests: builder.query({
			query: (args) => ({
				url: `/tests`,
				params: args,
			}),
		}),
	}),
})

export const {
	useSaveTestMutation,
    useGetTestsQuery,
    useLazyGetTestsQuery,
} = testApi
