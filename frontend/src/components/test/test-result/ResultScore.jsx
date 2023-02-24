const Score = ({ score, label }) => {
	return (
		<div className='wpm flex flex-col items-center'>
			<span className='score text-7xl'>{score}</span>
			<span className='score-label text-lg uppercase'>{label}</span>
		</div>
	)
}

export default Score
