import { configureStore } from '@reduxjs/toolkit'

import authReducer from './features/auth/authSlice'
import { apiSlice } from './api'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[apiSlice.reducerPath]: apiSlice.reducerPath,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
})
