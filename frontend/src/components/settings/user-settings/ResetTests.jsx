import { useState } from 'react'

import { useDeleteTestsMutation } from '../../../app/features/account/accountApi'

import Modal from '../../modal/Modal'
import Button from '../../button/Button'
import TextField from '../../text-field/TextField'
import Error from '../../errors/Error'

const initPayload = { password: '' }

const ResetTests = () => {
	const [modalOpen, setModalOpen] = useState()

	const [payload, setPayload] = useState(initPayload)

	const [error, setError] = useState()

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

			<div className='section-description w-2/3'>
				<span className='change-nickname'>Reset tests</span>
			</div>

            <div className='section-interaction min-w-50'>
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
