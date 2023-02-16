import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { setUser } from '../../app/features/auth/authSlice'
import {
	useLazyGetAuthenticatedUserQuery,
} from '../../app/features/auth/authApi'

import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from '../routes/ProtectedRoute'
import Header from '../header/Header'

import Test from '../test/Test'

import SignInForm from '../auth/SignInForm'
import SignUpForm from '../auth/SignUpForm'

import UserProfile from '../profile/UserProfile'
import Settings from '../settings/Settings'

import Error404 from '../errorPages/Error404'
import Error500 from '../errorPages/Error500'
import Spinner from '../spinner/Spinner'

const App = () => {
	const { user, token } = useSelector((state) => state.auth)

	const dispatch = useDispatch()

	const [getAuthenticatedUserQuery, { isLoading: userIsLoading }] =
		useLazyGetAuthenticatedUserQuery()

	useEffect(() => {
		if (token) {
			loadAuthenticatedUser()
		}
	}, [token])

	const handleError = (error) => {
		console.log(error)
	}

	const loadAuthenticatedUser = async () => {
		try {
			let res = await getAuthenticatedUserQuery(null, false).unwrap()
			dispatch(setUser(res))
		} catch (err) {
			handleError(err)
		}
	}

	return (
		<div className='App min-h-screen min-w-full flex flex-col text-txPrimary bg-bgPrimary overflow-hidden'>
			<div className='container min-w-full px-60 flex-1 flex flex-col gap-6'>
				<Header user={user} />

				{userIsLoading ? (
					<div className='spinner-wrapper flex-1 flex items-center justify-center'>
						<Spinner />
					</div>
				) : (
					<Routes>
						<Route path={'/'} element={<Test />} />

						<Route element={<ProtectedRoute token={token} />}>
							<Route path={'/settings'} element={<Settings />} />
						</Route>

						<Route
							path={'/profile/:userId'}
							element={<UserProfile />}
						/>

						<Route path={'/auth'}>
							<Route path={'signin'} element={<SignInForm />} />
							<Route path={'signup'} element={<SignUpForm />} />
						</Route>

						<Route path='/error'>
							<Route
								path={'/error/internal'}
								element={<Error500 />}
							/>
							<Route
								path={'/error/notfound'}
								element={<Error404 />}
							/>
						</Route>

						<Route path={'/*'} element={<Error404 />} />
					</Routes>
				)}
			</div>
		</div>
	)
}

export default App
