import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { setUser } from '../../app/features/auth/authSlice'
import { useLazyGetAuthenticatedUserQuery } from '../../app/features/auth/authApi'

import { setLanguage, setWords } from '../../app/features/text/textSlice'
import { useLoadTextQuery } from '../../app/features/text/textApi'

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

import RankingModal from '../ranking-modal/RankingModal'
import MaterialIcon from '../material-icon/MaterialIcon'
import Image from '../image/Image'

const App = () => {
	const { user, token } = useSelector((state) => state.auth)

	const [rankingModalOpen, setRankingModalOpen] = useState()

	const dispatch = useDispatch()

	const [getAuthenticatedUserQuery, { isLoading: userIsLoading }] =
		useLazyGetAuthenticatedUserQuery()

	const {
		data: textData,
		error: textError,
		isLoading: textIsLoading,
	} = useLoadTextQuery({ count: 500 })

	useEffect(() => {
		if (token) {
			loadAuthenticatedUser()
		}
	}, [token])

	useEffect(() => {
		if (textData) {
			dispatch(setWords(textData.words))
			dispatch(setLanguage(textData.language))
		}
		if (textError) {
			handleError(textError)
		}
	}, [textData, textError])

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

				<div
					className='ranking-button-wrapper fixed bottom-8 left-8 w-12 h-12'
					onClick={() => setRankingModalOpen(true)}
				>
					<Image icon={'emoji_flags'} rounded='rounded-md' />
				</div>

				{rankingModalOpen && (
					<RankingModal onClose={() => setRankingModalOpen(false)} />
				)}
			</div>
		</div>
	)
}

export default App
