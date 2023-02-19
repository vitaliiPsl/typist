const TableRow = ({ children, className, onClick }) => {
	return (
		<tr className={`table-row border-b border-txSecondary last-of-type:border-b-0 ${className}`} onClick={onClick}>
			{children}
		</tr>
	)
}

export default TableRow
