import { apiSlice } from '../../api'

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		signUp: builder.mutation({
			query: (user) => ({
				url: '/auth/signup',
				method: 'post',
				body: user,
			}),
		}),
        signIn: builder.mutation({
			query: (credentials) => ({
				url: '/auth/signin',
				method: 'post',
				body: credentials,
			}),
		}),
		getAuthenticatedUser: builder.query({
			query: () => '/account',
		}),
	}),
})

export const {
	useSignInMutation,
	useSignUpMutation,
    useLazyGetAuthenticatedUserQuery,
} = authApiSlice
