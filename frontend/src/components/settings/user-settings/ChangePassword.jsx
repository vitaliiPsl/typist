import { useState } from 'react'

import { useUpdatePasswordMutation } from '../../../app/features/account/accountApi'

import Modal from '../../modal/Modal'
import Button from '../../../components/button/Button'
import TextField from '../../../components/text-field/TextField'
import Error from '../../errors/Error'

const initPayload = {
	newPassword: '',
	oldPassword: '',
}

const ChangePassword = () => {
	const [modalOpen, setModalOpen] = useState()

	const [payload, setPayload] = useState(initPayload)

	const [error, setError] = useState()

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

			<div className='section-description-box w-1/2'>
				<span className='change-password'>Change password</span>
			</div>

            <div className='section-interaction min-w-50'>
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
