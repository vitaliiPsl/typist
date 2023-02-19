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
			query: (userId) => `/tests?userId=${userId}&sortBy=${'timestamp'}`,
		}),
		getTestsRanking: builder.query({
			query: (args) => ({
				url: `/tests?limit=${10}&direction=${'DESC'}`,
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
	useGetTestByUserIdQuery,
	useLazyGetTestsRankingQuery,
} = testApi
