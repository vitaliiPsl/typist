import { useEffect, useState } from 'react'

const TestText = ({ words, index, className }) => {
	const [wordsPerLine, setWordsPerLine] = useState(15)
	const [linesOnScreen, setLinesOnScreen] = useState(6)

	useEffect(() => {
		window.addEventListener('resize', () => adjustNumberOfWords())
		adjustNumberOfWords()
	}, [])

	useEffect(() => {
		adjustNumberOfWords()
	})

	const adjustNumberOfWords = () => {
		let testWords = document.querySelector('.test-words-box')
		let wordsWrapper = document.querySelector('.test-words-wrapper')

		if (!testWords || !wordsWrapper) return

		let wordsWidth = testWords.offsetWidth
		let wordsWrapperWidth = wordsWrapper.offsetWidth

		let averWordLength = 100
		let wordsBoxPadding = 24

		if (wordsWrapperWidth >= wordsWidth - wordsBoxPadding) {
			setWordsPerLine((wordsPerLine) => wordsPerLine - 1)
		} else if (wordsWidth - wordsWrapperWidth > averWordLength) {
			setWordsPerLine((wordsPerLine) => wordsPerLine + 1)
		}
	}

	const getWordLines = () => {
		let line = []
		let lines = []

		// line index = index of the current word / words per line
		let lineIndex = Math.floor(index / wordsPerLine)

		for (let i = 0; i < words.length; i++) {
			if (i % wordsPerLine === 0 && i !== 0) {
				lines.push(line)
				line = []
			}

			line.push(words[i])
		}
		lines.push(line)

		return getSliceOfLines(lines, lineIndex)
	}

	const getSliceOfLines = (lines, index) => {
		let lowerBound = 0
		let upperBound = linesOnScreen

		if (lines.length < linesOnScreen) {
			return lines
		}

		if (index >= linesOnScreen / 2) {
			lowerBound = index - Math.floor(linesOnScreen / 2)
			upperBound = index + Math.ceil(linesOnScreen / 2)
		}

		return lines.slice(lowerBound, upperBound)
	}

	return (
		<div
			className={`test-words-box ${className} w-full p-6 flex flex-col flex-wrap text-lg bg-bgTestText rounded-lg`}
		>
			<div className='test-words-wrapper flex flex-col'>
				{getWordLines().map((line, index) => (
					<div
						className='test-words-line flex justify-between'
						key={index}
					>
						{line}
					</div>
				))}
			</div>
		</div>
	)
}

export default TestText
