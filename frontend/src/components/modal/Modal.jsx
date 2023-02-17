// import './Modal.css'

const Modal = ({ title, children, onClose }) => {
	return (
		<div
			className={`modal-overlay h-screen w-full absolute top-0 left-0 flex items-center justify-center bg-bgSecondary bg-opacity-30`}
		>
			<div className='modal p-10 text-center flex flex-col gap-2 bg-bgPrimary border border-txPrimary rounded-lg relative'>
				<div
					className='close-btn p-1 absolute top-2 right-2 flex items-center justify-center rounded-md hover:bg-bgSecondary cursor-pointer'
					onClick={onClose}
				>
					<span className='material-symbols-outlined'>close</span>
				</div>

				<h2 className='modal-title font-semibold'>{title}</h2>

				{children}
			</div>
		</div>
	)
}

export default Modal

// export default class Modal extends React.Component {
// 	render() {
// 		return (
// 			<Overlay>
// 				<div className='Modal'>
// 					<h1 className='title'>{this.props.title}</h1>
// 					<form onSubmit={this.props.submit}>
// 						{this.props.children}
// 						<div className='form-row'>
// 							<button type='cancel' onClick={this.props.cancel}>
// 								Cancel
// 							</button>
// 							<button type='submit'>Submit</button>
// 						</div>
// 					</form>
// 				</div>
// 			</Overlay>
// 		)
// 	}
// }
