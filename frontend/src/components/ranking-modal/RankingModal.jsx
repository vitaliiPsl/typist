import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import { useLazyGetTestsQuery } from '../../app/features/test/testApi'

import Modal from '../modal/Modal'
import Spinner from '../spinner/Spinner'

import Table from '../table/Table'
import TableData from '../table/TableData'
import TableRow from '../table/TableRow'

const RankingModal = ({ onClose }) => {
	const { user } = useSelector((state) => state.auth)

	const [tests, setTests] = useState()

	const navigate = useNavigate()

	const [getTestsQuery, { isLoading }] = useLazyGetTestsQuery()

	useEffect(() => {
		loadTestRanking()
	}, [])

	const loadTestRanking = async () => {
		try {
			let args = { limit: 10, direction: 'DESC' }
			let tests = await getTestsQuery(args).unwrap()
			setTests(tests)
		} catch (err) {
			console.log(err)
		}
	}

	const navigateToUserProfile = (userId) => {
		navigate(`/profile/${userId}`)
		onClose()
	}

	const mapTestsToTableRows = (tests) => {
		return tests.map((test, idx) => mapTestToTableRow(test, idx))
	}

	const mapTestToTableRow = (test, idx) => {
		return (
			<TableRow
				onClick={() => navigateToUserProfile(test.user.id)}
				className={`tests-ranking-row cursor-pointer ${
					idx % 2 === 0 ? 'bg-bgSecondary' : ''
				}`}
				key={idx}
			>
				<TableData>{idx + 1}</TableData>
				<TableData>{test.wpm ? test.wpm : '-'}</TableData>
				<TableData>{test.accuracy ? test.accuracy : '-'}</TableData>
				<TableData>{test.user ? test.user.nickname : '-'}</TableData>
			</TableRow>
		)
	}

	return (
		<Modal
			title={'Ranking'}
			onClose={onClose}
			className={'min-h-0 h-96 overflow-hidden'}
		>
			{isLoading && <Spinner />}

			{tests && tests.length > 0 && (
				<div className='table-wrapper flex-1 overflow-y-auto'>
					<Table>
						<thead>
							<TableRow className={'head'}>
								<TableData>{'#'}</TableData>
								<TableData>{'wpm'}</TableData>
								<TableData>{'accuracy'}</TableData>
								<TableData>{'user'}</TableData>
							</TableRow>
						</thead>
						<tbody>
							{mapTestsToTableRows(tests)}
						</tbody>
					</Table>
				</div>
			)}

			{(!tests || tests.length === 0) && (
				<div className='no-test-box'>
					<span className='no-tests-message'>No tests yet</span>
				</div>
			)}
		</Modal>
	)
}

export default RankingModal
