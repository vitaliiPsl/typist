import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { clear } from '../../../app/features/auth/authSlice'
import { setNotification } from '../../../app/features/notification/notificationSlice'

import { useDeleteAccountMutation } from '../../../app/features/account/accountApi'

import Modal from '../../modal/Modal'
import Button from '../../button/Button'
import TextField from '../../text-field/TextField'

const initPayload = { password: '' }

const DeleteAccount = () => {
	const [modalOpen, setModalOpen] = useState()

	const [payload, setPayload] = useState(initPayload)

	const dispatch = useDispatch()

	const [deleteAccountQuery, { isLoading }] = useDeleteAccountMutation()

	const onSubmit = (e) => {
		e.preventDefault()

		deleteAccount(payload)
	}

	const onInputChange = (e) => {
		initPayload[e.target.name] = e.target.value
		setPayload((payload) => initPayload)
	}

	const deleteAccount = async (payload) => {
		try {
			await deleteAccountQuery(payload).unwrap()
			dispatch(clear())
            dispatch(setNotification({message: 'Your account has been successfully deleted!', type: 'success'}))

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
			<div className='section-description w-1/2'>
				<span className='change-nickname'>Delete account</span>
			</div>

            <div className='section-interaction min-w-50'>
				<Button onClick={() => setModalOpen((modalOpen) => true)}>
					Delete account
				</Button>
			</div>

			{modalOpen && (
				<Modal
					title={'Delete account'}
					onClose={() => setModalOpen((modalOpen) => false)}
				>
					<form onSubmit={onSubmit} className={'flex flex-col gap-2'}>
						<span>
							Enter the password to completely delete your account
						</span>

						<TextField
							type='password'
							name={'password'}
							placeholder='Password'
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

export default DeleteAccount
