import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	duration: 30,
	durationOptions: [15, 30, 60],
}

export const testConfigSlice = createSlice({
	name: 'test-config',
	initialState,
	reducers: {
		setDuration: (state, action) => {
			let duration = action.payload
			state.duration = duration
		},
        setDurationOptions: (state, action) => {
            let options = action.payload
            state.durationOptions = options
        }
	},
})

export const { setDuration } = testConfigSlice.actions

export default testConfigSlice.reducer
