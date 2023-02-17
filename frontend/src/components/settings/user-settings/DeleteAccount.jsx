import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { clear } from '../../../app/features/auth/authSlice'

import { useDeleteAccountMutation } from '../../../app/features/account/accountApi'

import Modal from '../../modal/Modal'
import Button from '../../button/Button'
import TextField from '../../text-field/TextField'
import Error from '../../errors/Error'

const initPayload = { password: '' }

const DeleteAccount = () => {
	const [modalOpen, setModalOpen] = useState()

	const [payload, setPayload] = useState(initPayload)

	const [error, setError] = useState()

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

			setModalOpen((modalOpen) => false)
		} catch (err) {
			handleError(err)
		}
	}

	const handleError = (error) => {
		let message = error.data.message
		setError((error) => message)
	}

	return (
		<div className='settings-section flex items-center justify-between gap-4'>
			{error && <Error message={error} onClose={() => setError(null)} />}

			<div className='section-description w-1/2'>
				<span className='change-nickname'>Delete account</span>
			</div>

			<div className='section-interaction'>
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
