const TextField = ({
	name,
	onChange,
	reference,
	placeholder,
	type = 'text',
	required = false,
	disabled = false,
	autoComplete = 'off',
	className = '',
	inputClassName = '',
}) => {
	return (
		<div
			className={`text-field ${className} min-w-0 w-full flex justify-center gap-6`}
		>
			<input
				name={name}
				type={type}
				ref={reference}
				onChange={onChange}
				required={required}
				disabled={disabled}
				placeholder={placeholder}
				autoComplete={autoComplete}
				className={`field ${inputClassName} min-h-11 w-full py-2 px-4 text-base text-txPrimary bg-bgPrimary border-2 border-txPrimary rounded-lg duration-500 focus:outline-none focus:text-bgPrimary focus:bg-txPrimary disabled:bg-bgSecondary`}
			/>
		</div>
	)
}

export default TextField
