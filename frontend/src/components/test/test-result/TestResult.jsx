import ResultScore from './ResultScore'

const TestResult = ({ result }) => {
	return (
		<div className='test-result w-full flex justify-between gap-4'>
            <ResultScore score={result.wpm.toFixed(1)} label={'wpm'} />

            <ResultScore score={result.rawWpm.toFixed(1)} label={'raw wpm'} />

            <ResultScore score={`${result.accuracy.toFixed(1)}%`} label={'accuracy'} />
            
            <ResultScore score={result.duration.toFixed(0)} label={'duration'} />
		</div>
	)
}

export default TestResult