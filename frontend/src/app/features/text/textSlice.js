import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	words: [],
	language: 'english',
}

export const textSlice = createSlice({
	name: 'text',
	initialState,
	reducers: {
		setWords: (state, action) => {
			let words = action.payload
			state.words = words
		},
		setLanguage: (state, action) => {
			let language = action.payload
			state.language = language
		},
	},
})

export const { setWords, setLanguage } = textSlice.actions

export default textSlice.reducer
