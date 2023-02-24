import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { setNotification } from '../../../app/features/notification/notificationSlice'
import { useUpdatePasswordMutation } from '../../../app/features/account/accountApi'

import Modal from '../../modal/Modal'
import Button from '../../../components/button/Button'
import TextField from '../../../components/text-field/TextField'

const initPayload = {
	newPassword: '',
	oldPassword: '',
}

const ChangePassword = () => {
	const [modalOpen, setModalOpen] = useState()

	const [payload, setPayload] = useState(initPayload)

    const dispatch = useDispatch()

	const [updatePasswordQuery, { isLoading }] = useUpdatePasswordMutation()

	const handleSubmit = (e) => {
		e.preventDefault()

		changePassword(payload)
	}

	const onInputChange = (e) => {
		initPayload[e.target.name] = e.target.value
		setPayload((payload) => initPayload)
	}

	const changePassword = async (payload) => {
		try {
			await updatePasswordQuery(payload).unwrap()
            dispatch(setNotification({message: 'Your password has been changed successfully!', type: 'success'}))

			setModalOpen((modalOpen) => false)
		} catch (err) {
			handleError(err)
		}
	}

	const handleError = (error) => {
		let message = error.data.message
		dispatch(setNotification({ message, type: 'error' }))
	}

	return (
		<div className='settings-section flex items-center justify-between gap-4'>
			<div className='section-description-box w-1/2'>
				<span className='change-password'>Change password</span>
			</div>

			<div className='section-interaction md:min-w-50'>
				<Button onClick={() => setModalOpen((modalOpen) => true)}>
					Change password
				</Button>
			</div>

			{modalOpen && (
				<Modal
					title={'Change password'}
					onClose={() => setModalOpen((modalOpen) => false)}
				>
					<form
						onSubmit={handleSubmit}
						className={'flex flex-col gap-2'}
					>
						<TextField
							type='password'
							name={'oldPassword'}
							placeholder='Old password'
							required={true}
							onChange={onInputChange}
						/>
						<TextField
							type='password'
							name={'newPassword'}
							placeholder='New password'
							required={true}
							onChange={onInputChange}
						/>
						<Button type={'submit'} isLoading={isLoading}>
							Submit
						</Button>
					</form>
				</Modal>
			)}
		</div>
	)
}

export default ChangePassword
