import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { setNotification } from '../../../app/features/notification/notificationSlice'

import { useLazyGetTestsQuery } from '../../../app/features/test/testApi'

import Spinner from '../../spinner/Spinner'
import TestsChart from './TestChart'
import TestsTable from './tests-table/TestsTable'

const UserTests = ({ userId }) => {
	const [tests, setTests] = useState(null)

	const dispatch = useDispatch()

	const [getTestsQuery, { isLoading }] = useLazyGetTestsQuery()

	useEffect(() => {
		if (userId) {
			loadTests(userId)
		}
	}, [userId])

	const loadTests = async (userId) => {
		try {
			let tests = await getTestsQuery({
				userId: userId,
				sortBy: 'timestamp',
			}).unwrap()
			setTests(tests)
		} catch (err) {
			handleError(err)
		}
	}

	const handleError = (error) => {
		let status = error.status

		if (status === 404 || status === 500) {
			throw { status: status, message: error.data.message }
		}

		dispatch(
			setNotification({ message: error.data.message, type: 'error' })
		)
	}

	return !tests ? (
		<div className='spinner-wrapper flex-1 flex items-center justify-center'>
			<Spinner />
		</div>
	) : (
		<div className='user-tests'>
			<TestsChart tests={tests} />
			<TestsTable tests={tests} />
		</div>
	)
}

export default UserTests
