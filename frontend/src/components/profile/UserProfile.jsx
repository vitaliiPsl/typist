import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setNotification } from '../../app/features/notification/notificationSlice'

import {
	useLazyGetUserByIdQuery,
} from '../../app/features/user/userApi'

import UserInfo from './UserDetails'
import Spinner from '../spinner/Spinner'
import UserTests from './user-tests/UserTests'

const UserProfile = ({}) => {
	const { userId } = useParams()
	const [user, setUser] = useState()

    const dispatch = useDispatch()

	const [getUserQuery, { isLoading }] = useLazyGetUserByIdQuery()

	useEffect(() => {
		if (userId) {
            loadUser(userId)
		}
	}, [userId])

	const loadUser = async (id) => {
		try {
			let user = await getUserQuery(id, false).unwrap()
			setUser(user)
		} catch (err) {
			handleError(err)
		}
	}

	const handleError = (error) => {
        let status = error.status

        if (status === 404 || status === 500) {
            throw {status: status, message: error.data.message}
        }

		dispatch(setNotification({message: error.data.message, type: 'error'}))
	}

	return (
		<div className='user-profile pb-6 min-h-0 flex-1 flex flex-col gap-6'>
			{isLoading && (
				<div className='spinner-wrapper flex-1 flex items-center justify-center'>
					<Spinner />
				</div>
			)}
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
