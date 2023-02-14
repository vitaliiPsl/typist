/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				highlight: '#df972c',

				// text
				txPrimary: '#fff',
				txSecondary: '#c8c8c8a5',
				txTestTextCorrect: '#fff',
				txTestTextError: '#f00',
				txTestTextExtra: '#ff5100',

				// background
				bgPrimary: '#303538',
				bgSecondary: '#535b5b',
				bgTestText: '#0000002c',
			},
			minHeight: {
				11: '44px',
			},
		},
	},
	plugins: [],
}
