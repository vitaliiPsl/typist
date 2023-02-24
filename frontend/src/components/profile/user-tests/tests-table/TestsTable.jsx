import { useEffect, useState } from 'react'

import moment from 'moment'

import Spinner from '../../../spinner/Spinner'
import Table from '../../../table/Table'
import TableData from '../../../table/TableData'
import TableRow from '../../../table/TableRow'

const TestsTable = ({ tests }) => {
	const [tableTests, setTableTests] = useState()

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
			<TableRow
				className={index % 2 == 0 ? 'bg-bgSecondary' : ''}
				key={index}
			>
				<TableData>{test.wpm}</TableData>
				<TableData>{test.rawWpm}</TableData>
				<TableData>{test.accuracy}</TableData>
				<TableData>{test.duration}</TableData>
				<TableData>{moment(test.timestamp).format('lll')}</TableData>
			</TableRow>
		)
	}

	return !tableTests ? (
		<Spinner />
	) : (
		<div className='user-tableTests-table'>
			{tableTests.length !== 0 && (
				<Table>
					<thead>
						<TableRow>
							<TableData
								onClick={sortByWpm}
								className='cursor-pointer'
							>
								{'WPM'}
							</TableData>

							<TableData
								onClick={sortByRawWpm}
								className='cursor-pointer'
							>
								{'Raw WPM'}
							</TableData>

							<TableData
								onClick={sortByAccuracy}
								className='cursor-pointer'
							>
								{'Accuracy'}
							</TableData>

							<TableData
								onClick={sortByDuration}
								className='cursor-pointer'
							>
								{'Duration'}
							</TableData>

							<TableData
								onClick={sortByTimestamp}
								className='cursor-pointer'
							>
								{'Timestamp'}
							</TableData>
						</TableRow>
					</thead>

					<tbody>{mapTestsToTableRows(tableTests)}</tbody>
				</Table>
			)}
		</div>
	)
}

export default TestsTable
