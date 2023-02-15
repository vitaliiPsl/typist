import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../../app/features/auth/authSlice'
import { useGetAuthenticatedUserQuery } from '../../app/features/auth/authApi'

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

const App = () => {
	const { user, token } = useSelector((state) => state.auth)

	const { data, error, isLoading } = useGetAuthenticatedUserQuery(null, {
		skip: !token,
	})

	const dispatch = useDispatch()

	useEffect(() => {
		if (data) {
			dispatch(setUser(data))
		}
		if (error) {
			handleUserError(error)
		}
	}, [data, error])

	const handleUserError = (error) => {
		console.log(error)
	}

	return (
		<div className='App min-h-screen min-w-full flex flex-col text-txPrimary bg-bgPrimary overflow-hidden'>
			<div className='container min-w-full px-60 flex-1 flex flex-col gap-6'>
				<Header user={user} />

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
			</div>
		</div>
	)
}

export default App
