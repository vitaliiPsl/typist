import React, { useEffect, useRef, useState } from 'react'

import { useSelector } from 'react-redux'

import { useSaveTestMutation } from '../../app/features/test/testApi'

import TextField from '../text-field/TextField'
import Word from './test-text/Word'
import TestText from './test-text/TestText'
import TestResult from './test-result/TestResult'
import TestConfig from './TestConfig'
import Spinner from '../spinner/Spinner'

const TEST_STATUS_NOT_STARTED = 'not started'
const TEST_STATUS_IN_PROGRESS = 'in progress'
const TEST_STATUS_COMPLETE = 'complete'

const Test = () => {
	// authenticated user
	const { user } = useSelector((state) => state.auth)

	// selected duration of the set
	const { duration } = useSelector((state) => state.testConfig)

	// words that test text is built from
	const { words, language } = useSelector((state) => state.text)

	// properties of the test: text to type, words that are displayed, number of typed characters, number of errors
	const [test, setTest] = useState()

	// result of the test
	const [result, setResult] = useState(null)

	// status of the test
	const [status, setStatus] = useState(TEST_STATUS_NOT_STARTED)

	// index of the current word
	const [index, setIndex] = useState(0)

	// time at the given moment of the test
	const [time, setTime] = useState(duration)

	// id of the interval that is responsible for updating the time of the test
	const [intervalId, setIntervalId] = useState(null)

	const inputRef = useRef()

	// query to save the test result
	const [saveTestQuery] = useSaveTestMutation()

	// prepare test properties when text is available
	useEffect(() => {
		if (words) {
			prepareTest()
		}
	}, [words])

	// end test if there is not time left or user has already entered all the words
	useEffect(() => {
		if (!test) return

		if ((intervalId && time === 0) || index === test.text.length) {
			endTest()
		}
	}, [time, index])

	// change the duration of the test on change of selected duration
	useEffect(() => {
		if (duration) {
			setTime((time) => duration)
		}
	}, [duration])

	// build the test text and initialize other properties
	const prepareTest = () => {
		let text = shuffleWords([...words]).map(word => word.toLowerCase())
		let testWords = prepareWords(text)

		let test = {
			// raw text
			text: text,
			// text displayed on the screen
			words: testWords,
			errorCount: 0,
			characterCount: 0,
		}

		setTest((_) => test)
		setIndex((_) => 0)
		setResult((_) => null)
		setTime((_) => duration)
		setStatus((_) => TEST_STATUS_NOT_STARTED)
	}

	// shuffle the text
	const shuffleWords = (words) => {
		for (let i = words.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))

			let tmp = words[i]
			words[i] = words[j]
			words[j] = tmp
		}

		return words
	}

	// break text into words and words into letters
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

	// start test: clear previous result, change status to 'in progress' and start the timer
	const startTest = () => {
		setStatus(() => TEST_STATUS_IN_PROGRESS)

		startTimer()
	}

	// restart test: stop timer, clear input and prepare new text and test properties
	const restartTest = () => {
		stopTimer()
		prepareTest()

		inputRef.current.value = ''
		inputRef.current.focus()
	}

	// end test: stop timer, change status and handle the result
	const endTest = () => {
		stopTimer()
		inputRef.current.blur()

		setStatus((_) => TEST_STATUS_COMPLETE)

		handleTestResult()
	}

	const startTimer = () => {
		let interval = setInterval(() => {
			setTime((time) => time - 1)
		}, 1000)

		setIntervalId((intervalId) => interval)
	}

	const stopTimer = () => {
		if (intervalId) {
			clearInterval(intervalId)
			setIntervalId((intervalId) => null)
		}
	}

	const mapWords = (words, index) => {
		return words.map((word, idx) => (
			<Word letters={word} current={idx === index} key={idx} />
		))
	}

	const onInput = () => {
		if (status === TEST_STATUS_NOT_STARTED) {
			startTest()
		}

		let input = inputRef.current.value

		let word = test.text[index]

		if (input[input.length - 1] !== ' ' || input.length <= 1) {
			updateWord(word, input)
			return
		}

		updateStats(word, input)
		inputRef.current.value = ''
	}

	const updateWord = (word, input) => {
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
		let characterCount = test.characterCount
		characterCount += input.length

		// remove space character
		input = input.slice(0, input.length - 1)

		let errorCount = test.errorCount
		errorCount += countErrors(word, input)

		setTest((test) => ({
			...test,
			characterCount,
			errorCount,
		}))

		setIndex((index) => index + 1)
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

	const handleTestResult = () => {
		// calculate actual duration
		let testDuration = duration - time

		let testResult = calculateResult(test, testDuration)
		setResult((result) => testResult)

		// save result of the test if user is signed in
		if (user) {
			saveTestResult(testResult)
		}
	}

	const saveTestResult = async (result) => {
		// if user is signed in the save result
		try {
			await saveTestQuery(result).unwrap()
		} catch (err) {
			console.log(err)
		}
	}

	const calculateResult = (test, testDuration) => {
		// convert from seconds to minutes
		let testDurationMins = testDuration / 60

		// normalized number of typed words = number of typed characters / 5
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
			duration: duration,
		}
	}

	if (test) {
		return (
			<div className='test py-10 min-w-0 flex-1 flex flex-col justify-center items-center gap-6 relative'>
				{status !== TEST_STATUS_IN_PROGRESS && (
					<TestConfig className={'absolute top-0 left-0'} />
				)}

				{status === TEST_STATUS_COMPLETE && result && (
					<TestResult result={result} />
				)}

				{status !== TEST_STATUS_COMPLETE && (
					<div className='test-timer-box flex justify-center'>
						<div className='test-timer text-7xl'>{time}</div>
					</div>
				)}

				<div className='test-input-box w-full flex justify-between gap-2'>
					<TextField
						className={'w-5/6'}
						inputClassName='text-lg'
						reference={inputRef}
						onChange={onInput}
						disabled={status === TEST_STATUS_COMPLETE}
					/>
					<button
						onClick={restartTest}
						className='flex px-4 items-center justify-center rounded-lg hover:bg-bgSecondary focus:bg-bgSecondary focus:outline-none focus:border-2 focus:border-txPrimary'
					>
						<span className='material-symbols-outlined'>
							restart_alt
						</span>
					</button>
				</div>

				<TestText
					className={''}
					index={test.index}
					words={mapWords(test.words, test.index)}
				/>
			</div>
		)
	} else {
		return (
			<div className='test py-10 min-w-0 flex-1 flex flex-col justify-center items-center gap-6 relative'>
				<Spinner />
			</div>
		)
	}
}

export default Test
