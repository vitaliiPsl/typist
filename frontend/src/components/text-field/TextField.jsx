const TextField = ({
	name,
	type = 'text',
	placeholder,
	onChange,
	reference,
	required = false,
	autoComplete = 'off',
	className = '',
	inputClassName = '',
}) => {
	return (
		<div
			className={`text-field ${className} w-full flex justify-center gap-6`}
		>
			<input
				name={name}
				type={type}
				placeholder={placeholder}
				onChange={onChange}
				required={required}
				autoComplete={autoComplete}
				ref={reference}
				className={`field ${inputClassName} py-2 px-4 text-base text-txPrimary bg-bgPrimary border-2 border-txPrimary rounded-lg duration-500 focus:outline-none focus:text-bgPrimary focus:bg-txPrimary`}
			/>
		</div>
	)
}

export default TextField
