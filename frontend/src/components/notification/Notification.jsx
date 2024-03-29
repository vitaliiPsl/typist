import { useEffect } from 'react'
import MaterialIcon from '../material-icon/MaterialIcon'

const Notification = ({ message, type, onClose, className }) => {
	let borderColor = type === 'error' ? 'red' : type === 'success' ? 'green' : 'white'

    useEffect(() => {
        setTimeout(() => {
            onClose()
        }, 10000)
    }, [])

	return (
		<div
			style={{
				borderColor: borderColor,
			}}
			className={`notification ${className} max-w-xs lg:min-w-40 py-2 px-6 pr-2 flex items-center justify-between gap-4 absolute bottom-4 right-4 border rounded-lg z-50`}
		>
			<div className='notification-message-box flex-1'>
				<span className='message text-clip'>{message}</span>
			</div>

			<MaterialIcon icon={'close'} onClick={onClose} />
		</div>
	)
}

export default Notification
