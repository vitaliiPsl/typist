import AuthFormWrapper from './AuthForm'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignUpMutation } from '../../app/features/auth/authApi'

import Button from '../button/Button'
import TextField from '../text-field/TextField'

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
