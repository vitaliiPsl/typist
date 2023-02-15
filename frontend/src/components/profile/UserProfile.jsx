import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import { useGetUserByIdQuery } from '../../app/features/user/userApi'

import UserInfo from './UserDetails'
import Spinner from '../spinner/Spinner'
import UserTests from './user-tests/UserTests'

const UserProfile = ({}) => {
	const { userId } = useParams()
	const [user, setUser] = useState()

	const { data, error } = useGetUserByIdQuery(userId, { skip: !userId })

	useEffect(() => {
		if (data) {
			setUser((user) => data)
		}
		if (error) {
			handleError(error)
		}
	}, [data, error])

	const handleError = (error) => {
		console.log(error)
	}

	return (
		<div className='user-profile pb-6 min-h-0 flex-1 flex flex-col gap-6'>
			{!user && <Spinner />}
			{user && (
				<>
					<UserInfo user={user} />
					<UserTests userId={userId} />
				</>
			)}
		</div>
	)
}

export default UserProfile
