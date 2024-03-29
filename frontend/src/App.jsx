import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { setUser } from './app/features/auth/authSlice'
import { useLazyGetAuthenticatedUserQuery } from './app/features/auth/authApi'

import { setLanguage, setWords } from './app/features/text/textSlice'
import { useLazyLoadTextQuery } from './app/features/text/textApi'

import { removeNotification } from './app/features/notification/notificationSlice'

import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/routes/ProtectedRoute'
import Header from './components/header/Header'

import Test from './components/test/Test'

import SignInForm from './components/auth/SignInForm'
import SignUpForm from './components/auth/SignUpForm'

import UserProfile from './components/profile/UserProfile'
import Settings from './components/settings/Settings'

import Spinner from './components/spinner/Spinner'

import Image from './components/image/Image'
import RankingModal from './components/ranking-modal/RankingModal'
import Notification from './components/notification/Notification'

import ErrorHandler from './components/error-hanlder/ErrorHandler'

const App = () => {
	const { user, token } = useSelector((state) => state.auth)
	const { notification } = useSelector((state) => state.notification)

	const [rankingModalOpen, setRankingModalOpen] = useState()

	const dispatch = useDispatch()

	const [getAuthenticatedUserQuery, { isLoading: userIsLoading }] =
		useLazyGetAuthenticatedUserQuery()

	const [getTextQuery, { isLoading: textIsLoading }] = useLazyLoadTextQuery()

	useEffect(() => {
		if (token) {
			loadAuthenticatedUser()
		}
	}, [token])

	useEffect(() => {
		loadText(500)
	}, [])

	const loadAuthenticatedUser = async () => {
		try {
			let res = await getAuthenticatedUserQuery(null, false).unwrap()
			dispatch(setUser(res))
		} catch (err) {
			handleError(err)
		}
	}

	const loadText = async (count) => {
		try {
			let res = await getTextQuery({ count }).unwrap()
			dispatch(setWords(res.words))
			dispatch(setLanguage(res.language))
		} catch (err) {
			handleError(err)
		}
	}

	const handleError = (error) => {
		console.log(error)
	}

	return (
		<div className='App min-h-screen min-w-full flex flex-col text-txPrimary bg-bgPrimary overflow-hidden'>
			<div className='container min-w-full px-4 md:px-10 lg:px-24 xl:px-60 2xl:px-80 flex-1 flex flex-col gap-6'>
				<Header user={user} />

				{userIsLoading || textIsLoading ? (
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
								element={
									<ErrorHandler
										error={{
											status: 500,
											message:
												'Something went wrong. Please, try again later',
										}}
									/>
								}
							/>
							<Route
								path={'/error/notfound'}
								element={
									<ErrorHandler
										error={{
											status: 404,
											message: 'Page not found',
										}}
									/>
								}
							/>
						</Route>

						<Route
							path={'/*'}
							element={
								<ErrorHandler
									error={{
										status: 404,
										message: 'Page not found',
									}}
								/>
							}
						/>
					</Routes>
				)}

				<>
					<div
						className='ranking-button-wrapper fixed bottom-8 left-8 w-12 h-12'
						onClick={() => setRankingModalOpen(true)}
					>
						<Image icon={'emoji_flags'} rounded='rounded-md' />
					</div>

					{rankingModalOpen && (
						<RankingModal
							onClose={() => setRankingModalOpen(false)}
						/>
					)}
				</>

				{notification && (
					<Notification
						message={notification.message}
						type={notification.type}
						onClose={() => dispatch(removeNotification())}
					/>
				)}
			</div>
		</div>
	)
}

export default App
