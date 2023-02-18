import MaterialIcon from "../material-icon/MaterialIcon"

const Image = ({ image, icon, onClick, className, rounded = 'rounded-full' }) => {
	return (
		<div
			className={`image-wrapper w-full h-full flex items-center justify-center overflow-hidden hover:border hover:border-txPrimary bg-bgSecondary cursor-pointer ${rounded} ${className}`}
			onClick={onClick}
		>
			{image && (
				<img
					id='image'
					src={image}
					alt=''
					className={`w-full h-full object-cover`}
				/>
			)}

			{!image && <MaterialIcon icon={icon} />}
		</div>
	)
}

export default Image
