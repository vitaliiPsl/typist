import React from "react";
import {Line} from "react-chartjs-2";
import Chart from 'chart.js/auto';

export default class TestsChart extends React.Component {
    constructor(props) {
        super(props);

        let tests = props.tests.sort(this.sortingByDatePredicate);
        let testsData = {
            labels: tests.map(test => ''),
            datasets: [{
                label: 'Typing speed',
                data: tests.map(test => test.wpm),
                // borderColor: this.props.styles.highlightColor,
                // backgroundColor: this.props.styles.highlightColor,
                borderColor: '#ffb547',
                backgroundColor: '#ffb547',
            },]
        }

        let options = {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Speed'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }

        this.state = {testsData, options};
    }

    sortingByDatePredicate(test1, test2) {
        let date1 = Date.parse(test1.testDate);
        let date2 = Date.parse(test2.testDate);

        if (date1 > date2) {
            return 1;
        } else if (date1 < date2) {
            return -1;
        } else {
            return 0;
        }
    }

    render() {
        return (
            <div className="TestsChart">
                <Line data={this.state.testsData} options={this.state.options}/>
            </div>
        );
    }
}