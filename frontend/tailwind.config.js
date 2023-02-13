/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				txPrimary: '#fff',
				txSecondary: '#dfdfdf',
				bgPrimary: '#303538',
				bgSecondary: '#535b5b',
				highlight: '#df972c',
			},
			minHeight: {
				11: '44px',
			},
		},
	},
	plugins: [],
}
