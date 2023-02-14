import { Route, Routes } from 'react-router-dom'

import Header from '../header/Header'

import SignInForm from '../auth/SignInForm'
import SignUpForm from '../auth/SignUpForm'

import Profile from '../profile/Profile'
import Settings from '../settings/Settings'

import Error404 from '../errorPages/Error404'
import Error500 from '../errorPages/Error500'

import Test from '../test/Test'

const App = () => {
	
	return (
		<div className='App min-h-screen min-w-full flex flex-col text-txPrimary bg-bgPrimary overflow-hidden'>
			<div className='container min-w-full px-40 flex-1 flex flex-col gap-6'>
				<Header />

				<Routes>
					<Route path={'/'} element={<Test />} />

					<Route path={'/settings'} element={<Settings />} />
					<Route path={'/profile/:id'} element={<Profile />} />

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
