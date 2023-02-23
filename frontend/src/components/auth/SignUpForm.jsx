import AuthFormWrapper from './AuthForm'

import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { setNotification } from '../../app/features/notification/notificationSlice'

import { useSignUpMutation } from '../../app/features/auth/authApi'

import Button from '../button/Button'
import TextField from '../text-field/TextField'

const initUserDetails = { nickname: '', email: '', password: '' }

const SignUpForm = ({}) => {
	const [userDetails, setUserDetails] = useState(initUserDetails)

    const dispatch = useDispatch()

	const [signUpQuery, { isLoading }] = useSignUpMutation()

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			await signUpQuery(userDetails).unwrap()
            dispatch(setNotification({message: "Thanks for registering! Please confirm your email by following the link in the email we sent you"}))
		} catch (err) {
			handleError(err)
		}
	}

    const handleError = (err) => {
		let status = err.status
		
        if (status === 500) {
			throw { status: err.status, message: err.data.message }
		}

        dispatch(setNotification({message: err.data.message, type: 'error'}))
	}

	const handleInputChange = (e) => {
		initUserDetails[e.target.name] = e.target.value

		setUserDetails((userDetails) => initUserDetails)
	}

	return (
		<AuthFormWrapper title={'Sign up'} onSubmit={handleSubmit}>
			<TextField
				name={'nickname'}
				required={true}
				placeholder={'Nickname'}
				onChange={handleInputChange}
			/>
			<TextField
				name={'email'}
				type={'email'}
				required={true}
				placeholder={'Email'}
				onChange={handleInputChange}
			/>
			<TextField
				name={'password'}
				type={'password'}
				required={true}
				placeholder={'Password'}
				onChange={handleInputChange}
			/>

			<Button type={'submit'} disabled={isLoading} isLoading={isLoading}>
				Sign up
			</Button>
		</AuthFormWrapper>
	)
}

export default SignUpForm
