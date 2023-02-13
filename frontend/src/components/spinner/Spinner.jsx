const Spinner = ({
	size = 'lg', // xs 24px without text | sm 36px without text | lg 80px with text
}) => {
	let wrapperSize = size === 'xs' ? 24 : size === 'sm' ? 36 : 80

	return (
		<div
			className={`spinner-wrapper relative`}
			style={{
				width: wrapperSize,
				height: wrapperSize,
			}}
		>
			<div className='spinner_ w-full h-full flex items-center justify-center border-4 border-txSecondary border-r-highlight rounded-full animate-spin'></div>

			{size === 'lg' && (
				<div className='spinner-text text-xs uppercase absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
					loading
				</div>
			)}
		</div>
	)
}

export default Spinner
