import { useRef, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { setUser } from '../../../app/features/auth/authSlice'
import { setNotification } from '../../../app/features/notification/notificationSlice'

import { useUploadImageMutation } from '../../../app/features/account/accountApi'

import { API_URL } from '../../../config'

import Modal from '../../modal/Modal'
import Button from '../../button/Button'
import Image from '../../image/Image'

const ChangeAccountImage = () => {
	const { user } = useSelector((state) => state.auth)

	const [modalOpen, setModalOpen] = useState()

	const [image, setImage] = useState(null)
	const [previewUrl, setPreviewUrl] = useState(null)
	const imageRef = useRef()

	const dispatch = useDispatch()

	const [uploadImageQuery, { isLoading }] = useUploadImageMutation()

	const onInputChange = (e) => {
		const image = e.target.files[0]

		setImage(image)

		if (image) {
			const reader = new FileReader()

			reader.onload = () => {
				setPreviewUrl(reader.result)
			}

			reader.readAsDataURL(image)
		} else {
			setPreviewUrl(null)
		}
	}

	const onSubmit = (e) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('image', image)

		uploadImage(formData)
	}

	const uploadImage = async (image) => {
		try {
			let user = await uploadImageQuery(image).unwrap()
			dispatch(setUser(user))
            dispatch(setNotification({message: 'Your account images has been changed successfully!', type: 'success'}))

			setModalOpen((modalOpen) => false)
		} catch (err) {
			handleError(err)
		}
	}

	const handleError = (error) => {
		let message = error.data.message
        dispatch(setNotification({ message, type: 'error' }))
	}

	const onImageClick = () => {
		imageRef.current.click()
	}

	return (
		<div className='settings-section flex items-center justify-between gap-4'>
			<div className='section-description w-1/2'>
				<span className='change-nickname'>Change account image</span>
			</div>

			<div className='section-interaction md:min-w-50 flex justify-center'>
				<div className='profile-image-box w-12 h-12'>
					<Image
						image={user?.image ? `${API_URL}/images/${user.image}` : null}
						icon={'person'}
						onClick={() => setModalOpen((modalOpen) => true)}
					/>
				</div>
			</div>

			{modalOpen && (
				<Modal
					title={'Change profile image'}
					onClose={() => setModalOpen((modalOpen) => false)}
				>
					<form
						onSubmit={onSubmit}
						className={'flex flex-col items-center gap-4'}
					>
						<div className='profile-image-box w-24 h-24'>
							<Image
								image={previewUrl}
								icon={'person'}
								onClick={onImageClick}
							/>
						</div>

						<input
							ref={imageRef}
							type='file'
							accept='image/*'
							className={'hidden'}
							onChange={onInputChange}
						/>

						<Button type={'submit'} disabled={!image}>
							Submit
						</Button>
					</form>
				</Modal>
			)}
		</div>
	)
}

export default ChangeAccountImage
