import { useEffect, useState } from 'react'

import moment from 'moment'

import TestsTableRow from './TestsTableRow'
import TestsTableData from './TestsTableData'
import Spinner from '../../../spinner/Spinner'

const TestsTable = ({ tests }) => {
	const [tableTests, setTableTests] = useState()
	const [sortDirection, setSortDirection] = useState(-1)

	useEffect(() => {
		setTableTests([...tests])
	}, [])

	const sortByWpm = () => {
		let sorted = tableTests.sort((test1, test2) => test2.wpm - test1.wpm)
		setTableTests((tableTests) => [...sorted])
	}

	const sortByRawWpm = () => {
		let sorted = tableTests.sort(
			(test1, test2) => test2.rawWpm - test1.rawWpm
		)
		setTableTests((tableTests) => [...sorted])
	}

	const sortByAccuracy = () => {
		let sorted = tableTests.sort(
			(test1, test2) => test2.accuracy - test1.accuracy
		)
		setTableTests((tableTests) => [...sorted])
	}

	const sortByDuration = () => {
		let sorted = tableTests.sort(
			(test1, test2) => test2.duration - test1.duration
		)
		setTableTests((tableTests) => [...sorted])
	}

	const sortByTimestamp = () => {
		let sorted = tableTests.sort(
			(test1, test2) =>
				Date.parse(test2.timestamp) - Date.parse(test1.timestamp)
		)
		setTableTests((tableTests) => [...sorted])
	}

	const mapTestsToTableRows = (tableTests) => {
		return tableTests.map((test, idx) => mapTestToTableRow(test, idx))
	}

	const mapTestToTableRow = (test, index) => {
		return (
			<TestsTableRow
				className={index % 2 == 0 ? 'bg-bgSecondary' : ''}
				key={index}
			>
				<TestsTableData data={test.wpm} />
				<TestsTableData data={test.rawWpm} />
				<TestsTableData data={test.accuracy} />
				<TestsTableData data={test.duration} />
				<TestsTableData data={moment(test.timestamp).format('lll')} />
			</TestsTableRow>
		)
	}

	return !tableTests ? (
		<Spinner />
	) : (
		<div className='user-tableTests-table'>
			{tableTests.length !== 0 && (
				<table className='tableTests-table w-full'>
					<thead>
						<TestsTableRow>
							<TestsTableData
								data={'WPM'}
								onClick={sortByWpm}
								className='cursor-pointer'
							/>
							<TestsTableData
								data={'Raw WPM'}
								onClick={sortByRawWpm}
								className='cursor-pointer'
							/>
							<TestsTableData
								data={'Accuracy'}
								onClick={sortByAccuracy}
								className='cursor-pointer'
							/>
							<TestsTableData
								data={'Duration'}
								onClick={sortByDuration}
								className='cursor-pointer'
							/>
							<TestsTableData
								data={'Timestamp'}
								onClick={sortByTimestamp}
								className='cursor-pointer'
							/>
						</TestsTableRow>
					</thead>
					<tbody>{mapTestsToTableRows(tableTests)}</tbody>
				</table>
			)}
		</div>
	)
}

export default TestsTable
