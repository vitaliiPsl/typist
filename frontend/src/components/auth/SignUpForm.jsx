import AuthFormWrapper from './AuthFormWrapper'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignUpMutation } from '../../app/features/auth/authApi'

import Button from '../button/Button'
import TextField from '../text-field/TextField'
import Spinner from '../spinner/Spinner'

const initUserDetails = { nickname: '', email: '', password: '' }

const SignUpForm = ({}) => {
	const [userDetails, setUserDetails] = useState(initUserDetails)

	const navigate = useNavigate()

	const [signUpQuery, { isLoading }] = useSignUpMutation()

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			await signUpQuery(userDetails).unwrap()
			navigate('/auth/signin')
		} catch (err) {
			console.log(err)
		}
	}

	const handleInputChange = (e) => {
		initUserDetails[e.target.name] = e.target.value

		setUserDetails((userDetails) => initUserDetails)
	}

	return (
		<AuthFormWrapper>
			<h1 className='auth-form-title text-xl'>Sign up</h1>

			<form onSubmit={handleSubmit}>
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

				<Button
					type={'submit'}
					disabled={isLoading}
					isLoading={isLoading}
				>
					Sign up
				</Button>
			</form>
		</AuthFormWrapper>
	)
}

export default SignUpForm
