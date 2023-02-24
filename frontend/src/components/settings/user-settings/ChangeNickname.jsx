import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { setUser } from '../../../app/features/auth/authSlice'
import { setNotification } from '../../../app/features/notification/notificationSlice'

import { useUpdateNicknameMutation } from '../../../app/features/account/accountApi'

import Modal from '../../modal/Modal'
import Button from '../../../components/button/Button'
import TextField from '../../../components/text-field/TextField'

const initPayload = {
	nickname: '',
	password: '',
}

const ChangeNickname = () => {
	const [modalOpen, setModalOpen] = useState()
	const [payload, setPayload] = useState(initPayload)

	const dispatch = useDispatch()

	const [updateNicknameQuery, { isLoading }] = useUpdateNicknameMutation()

	const onSubmit = (e) => {
		e.preventDefault()

		console.log(payload)
		changeNickname(payload)
	}

	const onInputChange = (e) => {
		initPayload[e.target.name] = e.target.value
		setPayload((payload) => initPayload)
	}

	const changeNickname = async (payload) => {
		try {
			let user = await updateNicknameQuery(payload).unwrap()

            dispatch(setUser(user))
            dispatch(setNotification({message: 'Your nickname has been changed successfully!', type: 'success'}))

			setModalOpen((modalOpen) => false)
		} catch (err) {
			handleError(err)
		}
	}

	const handleError = (error) => {
		let message = error.data.message

        dispatch(setNotification({message, type: 'error'}))
	}

	return (
		<div className='settings-section flex items-center justify-between gap-4'>
			<div className='section-description w-1/2'>
				<span className='change-nickname'>Change nickname</span>
			</div>

			<div className='section-interaction md:min-w-50'>
				<Button onClick={() => setModalOpen((modalOpen) => true)}>
					Change nickname
				</Button>
			</div>

			{modalOpen && (
				<Modal
					title={'Change nickname'}
					onClose={() => setModalOpen((modalOpen) => false)}
				>
					<form onSubmit={onSubmit} className={'flex flex-col gap-2'}>
						<TextField
							name={'nickname'}
							placeholder='New nickname'
							required={true}
							onChange={onInputChange}
						/>

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

export default ChangeNickname
