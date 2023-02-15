import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { clear } from '../../app/features/auth/authSlice'

import { NavLink, useNavigate } from 'react-router-dom'
import NavigationLink from './NavigationLink'

const Header = ({ user }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

    const logout = () => {
        dispatch(clear())
        navigate('/')
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

			<div className={'header-nav-box flex items-center gap-6'}>
				<NavigationLink to={'/'} label={'Home'} />

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
						<div onClick={logout} className='log-out-btn p-2 flex items-center justify-center hover:bg-bgSecondary rounded-md cursor-pointer'>
							<span class='material-symbols-outlined'>
								logout
							</span>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default Header
