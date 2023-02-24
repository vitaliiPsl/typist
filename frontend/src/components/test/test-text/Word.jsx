const Word = ({ letters, current }) => {
	let background = current ? '#4242427a' : 'transparent'

	const mapLetters = (letters) => {
		return letters.map((letter, idx) => (
			<Letter letter={letter.letter} type={letter.type} key={idx} />
		))
	}

	return (
		<div
			className='word py-1 px-2 flex rounded-md'
			style={{ background: background }}
		>
			{mapLetters(letters)}
		</div>
	)
}

const Letter = ({ letter, type }) => {
	const colors = new Map([
		['default', 'text-txSecondary'],
		['error', 'text-txTestTextError'],
		['extra', 'text-txTestTextExtra'],
		['correct', 'text-txTestTextCorrect'],
	])

	let color = colors.get(type)

	return <div className={`letter text-xl ${color}`}>{letter}</div>
}

export default Word
