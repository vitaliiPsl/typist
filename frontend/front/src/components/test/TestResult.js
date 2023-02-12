import React from "react";

export default class TestResult extends React.Component{

    render() {
        return (
            <div className="TestResult">
                <div className="wpm">
                    <span className="wpm-score score">
                        {this.props.result.wpm}
                    </span>
                    <h3>WPM</h3>
                </div>

                <div className="accuracy">
                    <span className="accuracy-score score">
                        {`${this.props.result.accuracy}%`}
                    </span>
                    <h3>Accuracy</h3>
                </div>
            </div>
        );
    }
}