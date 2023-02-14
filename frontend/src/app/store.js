import { configureStore } from '@reduxjs/toolkit'

import authReducer from './features/auth/authSlice'
import textReducer from './features/text/textSlice'
import testConfigReducer from './features/test/testConfigSlice'

import { apiSlice } from './api'

export const store = configureStore({
	reducer: {
		auth: authReducer,
        text: textReducer,
		testConfig: testConfigReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
})
