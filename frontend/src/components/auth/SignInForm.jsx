import AuthFormWrapper from './AuthForm'

import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setToken } from '../../app/features/auth/authSlice'
import { setNotification } from '../../app/features/notification/notificationSlice'
import { useSignInMutation } from '../../app/features/auth/authApi'

import Button from '../button/Button'
import TextField from '../text-field/TextField'

const initCredentials = { email: '', password: '' }

const SignInForm = ({}) => {
	const [credentials, setCredentials] = useState(initCredentials)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [signInQuery, { isLoading }] = useSignInMutation()

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			let res = await signInQuery(credentials).unwrap()
			let token = res.token

			dispatch(setToken(token))
			navigate('/')
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
		initCredentials[e.target.name] = e.target.value

		setCredentials((credentials) => initCredentials)
	}

	return (
		<AuthFormWrapper title={'Sign in'} onSubmit={handleSubmit}>
			<TextField
				className='form-row'
				name={'email'}
				type={'email'}
				required={true}
				placeholder={'Email'}
				onChange={handleInputChange}
			/>

			<TextField
				className='form-row'
				name={'password'}
				type={'password'}
				required={true}
				placeholder={'Password'}
				onChange={handleInputChange}
			/>

			<Button type={'submit'} disabled={isLoading} isLoading={isLoading}>
				Sign in
			</Button>
		</AuthFormWrapper>
	)
}

export default SignInForm
