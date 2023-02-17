import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { setUser } from '../../../app/features/auth/authSlice'
import { useUpdateNicknameMutation } from '../../../app/features/account/accountApi'

import Modal from '../../modal/Modal'
import Button from '../../../components/button/Button'
import TextField from '../../../components/text-field/TextField'
import Error from '../../errors/Error'

const initPayload = {
	nickname: '',
	password: '',
}

const ChangeNickname = () => {
	const [modalOpen, setModalOpen] = useState()
	const [payload, setPayload] = useState(initPayload)

	const [error, setError] = useState()

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
				<span className='change-nickname'>Change nickname</span>
			</div>

			<div className='section-interaction'>
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
