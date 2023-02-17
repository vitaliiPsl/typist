const MaterialIcon = ({ icon, onClick, className }) => {
	return (
		<div
			className={`material-icon ${className} p-2 flex items-center justify-center rounded-md hover:bg-bgSecondary cursor-pointer`}
			onClick={onClick}
		>
			<span className='material-symbols-outlined'>{icon}</span>
		</div>
	)
}

export default MaterialIcon
