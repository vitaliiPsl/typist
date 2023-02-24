import {
	createApi,
	fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import { API_URL } from '../config'

import { clear } from './features/auth/authSlice'

const baseQuery = fetchBaseQuery({
	baseUrl: API_URL,
	prepareHeaders: (headers, { getState }) => {
        let token = getState().auth.token

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        return headers
    },
})

const baseQueryWrapper = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 401) {
        api.dispatch(clear())
    }

    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWrapper,
    endpoints: builder => ({})
})