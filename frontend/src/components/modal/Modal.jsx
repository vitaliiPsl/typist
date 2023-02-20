// import './Modal.css'

import MaterialIcon from '../material-icon/MaterialIcon'

const Modal = ({ title, children, onClose, className }) => {
	return (
		<div
			className={`modal-overlay h-screen p-2 w-full absolute top-0 left-0 z-50 flex items-center justify-center bg-bgSecondary bg-opacity-30`}
		>
			<div className={`modal ${className} p-4 md:p-10 min-h-0 min-w-full md:min-w-100 text-center flex flex-col gap-6 bg-bgPrimary border border-txPrimary rounded-lg relative`}>
				<MaterialIcon
					icon={'close'}
					className={'absolute top-1 right-1'}
                    onClick={onClose}
				/>

				<h2 className='modal-title font-semibold'>{title}</h2>

				{children}
			</div>
		</div>
	)
}

export default Modal
