import MaterialIcon from '../material-icon/MaterialIcon'

const Error = ({ message, onClose }) => {
	return (
		<div className='error min-w-40 py-2 px-6 pr-2 flex items-center justify-between gap-4 absolute bottom-4 right-4 border border-red-600 rounded-lg z-50'>
			<div className='error-message-box flex-1'>
				<span className='error-message'>{message}</span>
			</div>

			<MaterialIcon icon={'close'} onClick={onClose} />
		</div>
	)
}

export default Error
