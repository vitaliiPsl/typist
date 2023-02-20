import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { setNotification } from '../../../app/features/notification/notificationSlice'
import { useDeleteTestsMutation } from '../../../app/features/account/accountApi'

import Modal from '../../modal/Modal'
import Button from '../../button/Button'
import TextField from '../../text-field/TextField'

const initPayload = { password: '' }

const ResetTests = () => {
	const [modalOpen, setModalOpen] = useState()

	const [payload, setPayload] = useState(initPayload)

    const dispatch = useDispatch()

	const [deleteTestsQuery, { isLoading }] = useDeleteTestsMutation()

	const onSubmit = (e) => {
		e.preventDefault()

		console.log(payload)
		deleteTests(payload)
	}

	const onInputChange = (e) => {
		initPayload[e.target.name] = e.target.value
		setPayload((payload) => initPayload)
	}

	const deleteTests = async (payload) => {
		try {
			await deleteTestsQuery(payload).unwrap()
            dispatch(setNotification({message: 'Your tests have been successfully reset!', type: 'success'}))

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
			<div className='section-description w-2/3'>
				<span className='change-nickname'>Reset tests</span>
			</div>

            <div className='section-interaction md:min-w-50'>
				<Button onClick={() => setModalOpen((modalOpen) => true)}>
					Reset tests
				</Button>
			</div>

			{modalOpen && (
				<Modal
					title={'Reset tests'}
					onClose={() => setModalOpen((modalOpen) => false)}
				>
					<form onSubmit={onSubmit} className={'flex flex-col gap-2'}>
						<span>Enter your password to reset the tests</span>

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

export default ResetTests
