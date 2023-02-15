const TestsTableData = ({data, onClick, className}) => {
	return (
		<td className={`tests-table-data p-2 text-center text-txPrimary ${className}`} onClick={onClick}>
			{data}
		</td>
	)
}

export default TestsTableData