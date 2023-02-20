const TableData = ({ children, onClick, className }) => {
	return (
		<td className={`table-data py-2 sm:p-2 text-sm sm:text-lg text-center text-txPrimary ${className}`} onClick={onClick}>
			{children}
		</td>
	)
}

export default TableData
