import React, { useEffect, useRef, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import TextField from '../text-field/TextField'
import Button from '../button/Button'
import Word from './test-text/Word'
import TestText from './test-text/TestText'
import TestResult from './test-result/TestResult'
import TestConfig from './TestConfig'

const TEST_STATUS_NOT_STARTED = 'not started'
const TEST_STATUS_IN_PROGRESS = 'in progress'
const TEST_STATUS_COMPLETE = 'complete'

const initTest = {
	// test text
	text: [],
	// test text broken into words and letters
	words: [],
	// current word
	index: 0,
	// test duration
	duration: 0,
	// number of errors
	errorCount: 0,
	// number of typed characters
	characterCount: 0,
}

const Test = () => {
	const { duration } = useSelector((state) => state.testConfig)
	const { words, language } = useSelector((state) => state.text)

	const [test, setTest] = useState()
	const [testResult, setTestResult] = useState({
		wpm: 85,
		rawWpm: 93,
		accuracy: 92,
		duration: 30,
	})
	const [testStatus, setTestStatus] = useState(TEST_STATUS_NOT_STARTED)

	const [testTime, setTestTime] = useState(duration)
	const [intervalId, setIntervalId] = useState(null)

	const inputRef = useRef()

	useEffect(() => {
		prepareTest()
	}, [])

	useEffect(() => {
		if (intervalId && testTime === 0) {
			endTest()
		}
	}, [testTime])

	useEffect(() => {
		if (duration) {
			setTestTime((_) => duration)
		}
	}, [duration])

	const prepareTest = () => {
		let text = shuffleWords([...words])
		let testWords = prepareWords(text)

		let test = {
			text: text,
			words: testWords,
			index: 0,
			duration: duration,
			errorCount: 0,
			characterCount: 0,
		}

		setTest((_) => test)
		setTestTime((_) => duration)
		setTestStatus((_) => TEST_STATUS_NOT_STARTED)
	}

	const shuffleWords = (words) => {
		for (let i = words.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))

			let tmp = words[i]
			words[i] = words[j]
			words[j] = tmp
		}

		return words
	}

	const prepareWords = (words) => {
		return words.map((word, idx) => {
			return word.split('').map((letter, index) => {
				return {
					letter: letter,
					type: 'default',
				}
			})
		})
	}

	const startTest = () => {
		setTestStatus(() => TEST_STATUS_IN_PROGRESS)

		startTimer()
	}

	const restartTest = () => {
		stopTimer()

		inputRef.current.value = ''
		inputRef.current.focus()

		prepareTest()
	}

	const endTest = () => {
		stopTimer()
		inputRef.current.blur()

		setTestStatus((_) => TEST_STATUS_COMPLETE)

		handleTestResult(test)
	}

	const startTimer = () => {
		let interval = setInterval(() => {
			setTestTime((testTime) => testTime - 1)
		}, 1000)

		setIntervalId((_) => interval)
	}

	const stopTimer = () => {
		if (intervalId) {
			clearInterval(intervalId)
			setIntervalId((_) => null)
		}
	}

	const mapWords = (words, index) => {
		return words.map((word, idx) => (
			<Word letters={word} current={idx === index} key={idx} />
		))
	}

	const onInput = () => {
		if (testStatus === TEST_STATUS_NOT_STARTED) {
			startTest()
		}

		let input = inputRef.current.value

		let index = test.index
		let word = test.text[index]

		if (input[input.length - 1] === ' ' && input.length > 1) {
			updateStats(word, input, index)
			inputRef.current.value = ''
		} else {
			updateWord(word, input, index)
		}
	}

	const updateWord = (word, input, index) => {
		let letters = []

		let wordLetters = word.split('')
		let inputLetters = input.split('')

		let i = 0
		for (; i < wordLetters.length && i < inputLetters.length; i++) {
			if (wordLetters[i] === inputLetters[i]) {
				letters.push({ letter: wordLetters[i], type: 'correct' })
			} else {
				letters.push({ letter: wordLetters[i], type: 'error' })
			}
		}

		while (i < inputLetters.length) {
			letters.push({ letter: inputLetters[i++], type: 'extra' })
		}

		while (i < wordLetters.length) {
			letters.push({ letter: wordLetters[i++], type: 'default' })
		}

		let words = test.words
		words[index] = letters

		setTest((_) => ({ ...test, words }))
	}

	const updateStats = (word, input) => {
		console.log(word)
		console.log(input)
        
		input = input.slice(0, input.length - 1)

		let characterCount = test.characterCount
		characterCount += input.length + 1 // include space character

		let errorCount = test.errorCount
		errorCount += countErrors(word, input)

		let index = test.index
		index += 1

		setTest((_) => ({ ...test, characterCount, errorCount, index }))
	}

	const countErrors = (word, input) => {
		let errorCount = Math.abs(word.length - input.length)

		for (let i = 0; i < word.length && i < input.length; i++) {
			if (word[i] !== input[i]) {
				errorCount++
			}
		}

		return errorCount
	}

	const handleTestResult = (test) => {
		console.log(test)
		let result = calculateResult(test)

		setTestResult((_) => result)

		try {
			// save test result
			console.log(result)
		} catch (err) {
			console.log(err)
		}
	}

	const calculateResult = (test) => {
		let testDurationMins = test.duration / 60

		let normalizedWordsCount = test.characterCount / 5

		let correctCharactersCount = test.characterCount - test.errorCount

		// raw wpm = (typed characters / 5) / test duration in minutes
		let rawWpm = normalizedWordsCount / testDurationMins

		// wmp = (raw wmp - errors) / test duration in minutes
		let wpm = (normalizedWordsCount - test.errorCount) / testDurationMins

		// accuracy = number of correct characters / total number of typed characters
		let accuracy = (correctCharactersCount / test.characterCount) * 100

		return {
			wpm,
			rawWpm,
			accuracy,
			duration: test.duration,
		}
	}

	if (test) {
		return (
			<div className='test py-10 min-w-0 w-full h-full flex flex-col justify-center items-center gap-6 absolute'>
				<TestConfig className={'absolute top-0 left-0'} />

				{testStatus === TEST_STATUS_COMPLETE && testResult && (
					<TestResult result={testResult} />
				)}

				{testStatus !== TEST_STATUS_COMPLETE && (
					<div className='test-timer-box flex justify-center'>
						<div className='test-timer text-7xl'>{testTime}</div>
					</div>
				)}

				<div className='test-input-box w-full flex justify-between gap-2'>
					<TextField
						className={'w-5/6'}
						inputClassName='text-lg'
						reference={inputRef}
						onChange={onInput}
						disabled={testStatus === TEST_STATUS_COMPLETE}
					/>
					<Button className={'w-1/6'} onClick={restartTest}>
						Restart
					</Button>
				</div>

				<TestText
					className={''}
					index={test.index}
					words={mapWords(test.words, test.index)}
				/>
			</div>
		)
	} else {
		return <div className='test'></div>
	}
}

export default Test
