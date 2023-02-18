import { apiSlice } from '../../api'

export const accountApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (image) => ({
				url: '/account/image',
				method: 'post',
				body: image,
			}),
        }),
		updateNickname: builder.mutation({
			query: (payload) => ({
				url: '/account/nickname',
				method: 'put',
				body: payload,
			}),
		}),
		updatePassword: builder.mutation({
			query: (payload) => ({
				url: '/account/password',
				method: 'put',
				body: payload,
			}),
		}),
		deleteTests: builder.mutation({
			query: (payload) => ({
				url: '/account/tests',
				method: 'delete',
				body: payload,
			}),
		}),
		deleteAccount: builder.mutation({
			query: (payload) => ({
				url: '/account',
				method: 'delete',
				body: payload,
			}),
		}),
	}),
})

export const {
    useUploadImageMutation,
	useUpdateNicknameMutation,
	useUpdatePasswordMutation,
	useDeleteTestsMutation,
    useDeleteAccountMutation
} = accountApiSlice
