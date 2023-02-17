import ChangeNickname from './user-settings/ChangeNickname'
import ChangePassword from './user-settings/ChangePassword'
import ResetTests from './user-settings/ResetTests'

const Settings = ({}) => {
	return (
		<div className='settings flex-1 flex flex-col gap-8'>
			<div className='settings-section-wrapper flex flex-col gap-4'>
				<span className='text-xl font-semibold'>User settings</span>

				<ChangeNickname />
				<ChangePassword />
				<ResetTests />
			</div>
		</div>
	)
}

export default Settings
