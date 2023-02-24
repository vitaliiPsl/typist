import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	notification: null
}

export const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		setNotification: (state, action) => {
			let notification = action.payload
			state.notification = notification
		},
        removeNotification: (state, action) => {
            state.notification = null
        }
	},
})

export const { setNotification, removeNotification } = notificationSlice.actions

export default notificationSlice.reducer
