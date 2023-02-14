const AuthForm = ({ title, onSubmit, children }) => {
	return (
		<div className='auth-form-wrapper w-full flex-1 flex flex-col items-center justify-center gap-4'>
			<h1 className='auth-form-title text-xl'>{title}</h1>

			<form onSubmit={onSubmit} className='flex flex-col gap-4'>
				{children}
			</form>
		</div>
	)
}

export default AuthForm
