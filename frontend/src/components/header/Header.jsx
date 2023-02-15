import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { clear } from '../../app/features/auth/authSlice'

import { NavLink, useNavigate } from 'react-router-dom'
import NavigationLink from './NavigationLink'

const Header = ({ user }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	return (
		<div className='header py-4 flex justify-between'>
			<div className='header-title-box'>
				<NavLink to={'/'}>
					<span className='header-title'>Typist</span>
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
					</>
				)}
			</div>
		</div>
	)
}

export default Header
