const TableData = ({ children, onClick, className }) => {
	return (
		<td className={`table-data p-2 text-lg text-center text-txPrimary ${className}`} onClick={onClick}>
			{children}
		</td>
	)
}

export default TableData
