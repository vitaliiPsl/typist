/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				highlight: '#df972c',

				// text
				txPrimary: '#fff',
				txSecondary: '#cacaca',
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
			minWidth: {
				30: '120px',
				40: '160px',
				50: '200px',
			},
		},
	},
	plugins: [],
}
