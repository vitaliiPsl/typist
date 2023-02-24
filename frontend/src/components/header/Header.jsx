import { useDispatch } from 'react-redux'
import { clear } from '../../app/features/auth/authSlice'

import { NavLink, useNavigate } from 'react-router-dom'

import NavigationLink from './NavigationLink'
import Image from '../image/Image'
import MaterialIcon from '../material-icon/MaterialIcon'
import { useState } from 'react'

const Header = ({ user }) => {
	const [menuOpen, setMenuOpen] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const logout = () => {
		dispatch(clear())
		closeMenu()
		navigate('/')
	}

	const closeMenu = () => {
		setMenuOpen(false)
	}

	return (
		<div className='header py-4 flex justify-between'>
			<div className='header-title-box flex items-center justify-center'>
				<NavLink to={'/'}>
					<span className='header-title text-2xl font-medium'>
						Typist
					</span>
				</NavLink>
			</div>

			<div
				className={'header-nav-box hidden lg:flex items-center gap-6 '}
			>
				<NavigationLink to={'/'} label={'Test'} />

				{!user && (
					<>
						<NavigationLink to={'/auth/signin'} label={'Sign in'} />
						<NavigationLink to={'/auth/signup'} label={'Sign up'} />
					</>
				)}

				{user && (
					<>
						<NavigationLink to={'/settings'} label={'Settings'} />
						<NavigationLink
							to={`/profile/${user.id}`}
							label={user.nickname}
						/>
						<MaterialIcon icon={'logout'} onClick={logout} />
					</>
				)}
			</div>

			<div className='header-nav-burger-menu lg:hidden z-20'>
				<Image
					rounded='rounded-md'
					className={'hover:border-0'}
					icon={menuOpen ? 'close' : 'menu'}
					onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
				/>
			</div>

			<div
				className={`header-nav-menu-box fixed top-0 right-0 z-10 h-full w-full py-10 px-20 flex flex-col items-stretch justify-center gap-8 bg-[#000d] ${
					menuOpen ? '-translate-y-0' : '-translate-y-full'
				} ease-in duration-300`}
			>
				<NavigationLink
					to={'/'}
					label={'Test'}
					onClick={closeMenu}
					className={'border border-txPrimary rounded-lg'}
				/>

				{!user && (
					<>
						<NavigationLink
							to={'/auth/signin'}
							label={'Sign in'}
							className={'border border-txPrimary rounded-lg'}
							onClick={closeMenu}
						/>
						<NavigationLink
							to={'/auth/signup'}
							label={'Sign up'}
							className={'border border-txPrimary rounded-lg'}
							onClick={closeMenu}
						/>
					</>
				)}

				{user && (
					<>
						<NavigationLink
							to={'/settings'}
							label={'Settings'}
                            className={'border border-txPrimary rounded-lg'}
							onClick={closeMenu}
						/>

						<div className='profile-nav-link w-full flex gap-2'>
							<NavigationLink
								to={`/profile/${user.id}`}
								label={user.nickname}
                                className={'border border-txPrimary rounded-lg flex-1'}
								onClick={closeMenu}
							/>
							<MaterialIcon icon={'logout'} onClick={logout} />
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default Header
