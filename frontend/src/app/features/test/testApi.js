import { apiSlice } from '../../api'

export const testApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		saveTest: builder.mutation({
			query: (test) => ({
				url: '/api/tests',
				method: 'post',
				body: test,
			}),
		}),
		getTestByUserId: builder.query({
			query: (args) => `/api/tests?useId=${args.userId}`,
		}),
	}),
})

export const { useSaveTestMutation } = testApi
