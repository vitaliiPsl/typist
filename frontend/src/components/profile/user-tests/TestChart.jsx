import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
)

const TestsChart = ({ tests }) => {
	const options = {
		responsive: true,
        color: '#fff',
		scales: {
			yAxes: {
				ticks: {
					color: '#d8d8d8',
				},
			},
			xAxes: {
				ticks: {
					color: '#d8d8d8',
				},
			},
		},
	}

	const mapTests = (tests) => {
		return {
			labels: tests.map((test) => ''),
			datasets: [
				{
					label: 'WPM',
					data: tests.map((test) => test.wpm),
					borderColor: ['#df972c'],
					backgroundColor: ['#df972c'],
				},
			],
		}
	}

	return (
		<div className='user-tests-chart'>
			<Line data={mapTests(tests)} options={options} />
		</div>
	)
}

export default TestsChart
