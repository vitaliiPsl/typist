import NavigationLink from '../header/NavigationLink'

const ErrorHandler = ({ error }) => {
	return (
		<div className='error-handler flex-1 flex flex-col items-center justify-center gap-6 text-center'>
			<span className='error-code text-8xl'>{error.status}</span>

			<h2 className='error-message text-lg'>{error.message}</h2>

			<NavigationLink to={'/'} label={'Go home'} className={'border border-highlight rounded-lg hover:bg-highlight duration-300'}/>
		</div>
	)
}

export default ErrorHandler
