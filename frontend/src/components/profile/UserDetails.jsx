const UserDetails = ({ user }) => {
	return (
		<div className='profile-user-details py-4 flex items-center justify-around gap-6 border-b border-b-txSecondary'>
			<div className='profile-user-avatar-box w-14 h-14 flex-shrink-0 flex items-center justify-center bg-zinc-800 text-white border-2 border-white rounded-full overflow-hidden'>
				{user.avatar && (
					<img src={user.avatar} alt='' className='user-avatar' />
				)}
				{!user.avatar && (
					<span className='material-symbols-outlined user-avatar'>
						person
					</span>
				)}
			</div>
			<div className='profile-user-nickname-box'>
				<span className='profile-user-nickname text-2xl'>
					{user.nickname}
				</span>
			</div>
		</div>
	)
}

export default UserDetails
