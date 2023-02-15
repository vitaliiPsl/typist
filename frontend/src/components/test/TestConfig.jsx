import { useDispatch, useSelector } from 'react-redux'

import { setDuration } from '../../app/features/test/testConfigSlice'

const TestConfig = ({className}) => {
	const { duration, durationOptions } = useSelector(
		(state) => state.testConfig
	)

	const dispatch = useDispatch()

	const handleDurationSelection = (duration) => {
		dispatch(setDuration(duration))
	}

	const mapOptions = (options) => {
		return options.map((option, index) => (
			<span
				className={`config-option cursor-pointer ${
					option === duration && 'text-highlight'
				}`}
				onClick={() => handleDurationSelection(option)}
				key={index}
			>
				{option}
			</span>
		))
	}

	return (
		<div className={`test-config ${className}`}>
			<div className='config-row text-lg flex gap-2 duration'>
				<span>time: </span>
				{mapOptions(durationOptions)}
			</div>
		</div>
	)
}

export default TestConfig
