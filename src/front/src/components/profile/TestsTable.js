import React from "react";

export default class TestsTable extends React.Component {
    constructor(props) {
        super(props);

        let tests = this.props.tests;
        // number of rows to display in table
        let numberOfRows = 5;
        let increaseNumber = 5;

        this.state = {tests, numberOfRows, increaseNumber};

        this.getTableRow = this.getTableRow.bind(this);
        this.showMore = this.showMore.bind(this);
    }

    componentDidMount() {
        this.sortByDate();
    }

    sortByDate() {
        let tests = this.state.tests;

        tests.sort((test1, test2) => {
            let date1 = Date.parse(test1.testDate);
            let date2 = Date.parse(test2.testDate);
            return this.testsComparator(date1, date2);
        });

        this.setState({tests})
    }

    sortByWpm() {
        console.log('sort')
        let tests = this.state.tests;

        tests.sort((test1, test2) => this.testsComparator(test1.wpm, test2.wpm));

        this.setState({tests})
    }

    sortByTime() {
        let tests = this.state.tests;

        tests.sort((test1, test2) => this.testsComparator(test1.time, test2.time));

        this.setState({tests})
    }

    sortByAccuracy() {
        let tests = this.state.tests;

        tests.sort((test1, test2) => this.testsComparator(test1.accuracy, test2.accuracy));

        this.setState({tests})
    }

    testsComparator(comparable1, comparable2) {
        return comparable2 - comparable1;
    }

    getTableRow(index, test) {
        return <tr key={index}>
            <td>{test.wpm}</td>
            <td>{`${test.accuracy}%`}</td>
            <td>{test.time}</td>
            <td>{new Date(test.testDate).toLocaleString()}</td>
        </tr>
    }

    showMore() {
        let numberOfTakenTests = this.state.tests.length;
        let numberOfRows = this.state.numberOfRows;
        numberOfRows += this.state.increaseNumber;
        numberOfRows = numberOfRows > numberOfTakenTests ? numberOfTakenTests : numberOfRows;

        this.setState({numberOfRows})
    }

    render() {
        return (
            <div className="TestsTable">
                {this.props.tests.length !== 0 &&
                    <>
                        <table>
                            <thead>
                            <tr>
                                <td onClick={() => this.sortByWpm()}>{"wpm"}</td>
                                <td onClick={() => this.sortByAccuracy()}>{"accuracy"}</td>
                                <td onClick={() => this.sortByTime()}>{"time"}</td>
                                <td onClick={() => this.sortByDate()}>{"date"}</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.tests.map((test, index) => this.getTableRow(index, test)).slice(0, this.state.numberOfRows)
                            }
                            </tbody>
                        </table>

                        {this.state.numberOfRows < this.state.tests.length &&
                            <button className="show-more-button" onClick={this.showMore}>Show more</button>
                        }
                    </>
                }
            </div>
        );
    }
}
