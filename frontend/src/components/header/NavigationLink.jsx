import { NavLink } from 'react-router-dom'

const NavigationLink = ({ label, to }) => {
	return (
		<div className='navigation-link min-w-30 text-center'>
			<NavLink
				to={to}
				className={({ isActive }) =>
					isActive
						? 'py-1 px-2 rounded-md duration-150 text-center bg-highlight'
						: 'py-1 px-2 rounded-md duration-150 text-center'
				}
			>
				<span className='font-medium'>{label}</span>
			</NavLink>
		</div>
	)
}

export default NavigationLink
