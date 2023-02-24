import { NavLink } from 'react-router-dom'

const NavigationLink = ({ label, to, className, onClick }) => {
	return (
		<div className={`navigation-link min-w-30 ${className}`} onClick={onClick}>
			<NavLink
				to={to}
				className={({ isActive }) =>
					`w-full h-full py-2 px-2 flex items-center justify-center rounded-md duration-150 text-center ${
						isActive ? 'bg-highlight' : ''
					}`
				}
			>
				<span className='font-medium'>{label}</span>
			</NavLink>
		</div>
	)
}

export default NavigationLink
