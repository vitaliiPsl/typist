import Spinner from '../spinner/Spinner'

const Button = ({
	type,
	onClick,
	className,
	children,
	disabled,
	isLoading,
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`btn ${className} min-h-11 min-w-0 w-full py-2 px-4 gap-2 text-txPrimary bg-bgPrimary border-2 border-txPrimary rounded-lg cursor-pointer duration-500 hover:text-bgPrimary hover:bg-txPrimary focus:text-bgPrimary focus:bg-txPrimary focus:outline-none disabled:text-txSecondary disabled:bg-bgSecondary relative`}
		>
			{children}

			{isLoading && (
				<div className='loader absolute top-1/2 left-2 -translate-y-1/2'>
					<Spinner size='xs' />
				</div>
			)}
		</button>
	)
}

export default Button
