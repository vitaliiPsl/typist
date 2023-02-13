const AuthFormWrapper = ({ children }) => {
	return (
		<div className='auth-form-wrapper w-full flex-1 flex flex-col items-center justify-center gap-4'>
			{children}
		</div>
	)
}

export default AuthFormWrapper
