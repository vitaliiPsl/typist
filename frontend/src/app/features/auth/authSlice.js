import { createSlice } from '@reduxjs/toolkit'

export const TOKEN_KEY = 'token'

const token = localStorage.getItem(TOKEN_KEY)

const initialState = {
	user: null,
	token: token,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state, action) => {
			let user = action.payload
			state.user = user
		},
		setToken: (state, action) => {
			let token = action.payload
			state.token = token

			localStorage.setItem(TOKEN_KEY, token)
		},
		clear: (state) => {
			state.user = null
			state.token = null

			localStorage.removeItem(TOKEN_KEY)
		},
	},
})

export const { setUser, setToken, clear } = authSlice.actions

export default authSlice.reducer
