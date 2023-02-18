import Image from '../image/Image'

import { API_URL } from '../../config'

const UserDetails = ({ user }) => {
	return (
		<div className='profile-user-details py-4 flex items-center justify-around gap-6 border-b border-b-txSecondary'>
			<div className='image-wrapper w-16 h-16'>
				<Image
					image={
						user.image ? `${API_URL}/images/${user.image}` : null
					}
					icon={'person'}
				/>
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
