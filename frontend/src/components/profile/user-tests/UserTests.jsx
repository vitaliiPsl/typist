import { useEffect, useState } from 'react'

import { useGetTestByUserIdQuery } from '../../../app/features/test/testApi'
import Spinner from '../../spinner/Spinner'
import TestsChart from './TestChart'
import TestsTable from './tests-table/TestsTable'

const UserTests = ({ userId }) => {
	const [tests, setTests] = useState(null)

	const { data, error, isLoading } = useGetTestByUserIdQuery(userId)

	useEffect(() => {
		if (data) {
			console.log(data)
			setTests((tests) => data)
		}
		if (error) {
			handleError(error)
		}
	}, [data, error])

	const handleError = (err) => {
		console.log(err)
	}

	return !tests ? (
		<Spinner />
	) : (
		<div className='user-tests'>
			<TestsChart tests={tests} />
			<TestsTable tests={tests} />
		</div>
	)
}

export default UserTests
