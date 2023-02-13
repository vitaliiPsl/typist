import AuthFormWrapper from './AuthFormWrapper'

import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setToken } from '../../app/features/auth/authSlice'
import { useSignInMutation } from '../../app/features/auth/authApi'

import Button from '../button/Button'
import TextField from '../text-field/TextField'
import Spinner from '../spinner/Spinner'

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
			let token = res.data?.token

			dispatch(setToken(token))
			navigate('/')
		} catch (err) {
			console.log(err)
		}
	}

	const handleInputChange = (e) => {
		initCredentials[e.target.name] = e.target.value

		setCredentials((credentials) => initCredentials)
	}

	return (
		<AuthFormWrapper>
			<h1 className='auth-form-title text-xl'>Sign in</h1>

			<form onSubmit={handleSubmit}>
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

				<Button
					type={'submit'}
					disabled={isLoading}
					isLoading={isLoading}
				>
					Sign in
				</Button>
			</form>
		</AuthFormWrapper>
	)
}

export default SignInForm
