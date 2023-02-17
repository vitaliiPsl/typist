import ChangeNickname from './user-settings/ChangeNickname'

const Settings = ({}) => {
	return (
		<div className='settings flex-1 flex flex-col gap-8'>
			<div className='settings-section-wrapper flex flex-col gap-4'>
				<span className='text-xl font-semibold'>User settings</span>
                
				<ChangeNickname />
			</div>
		</div>
	)
}

export default Settings
