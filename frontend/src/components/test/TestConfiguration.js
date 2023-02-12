import React from "react";

export default class TestConfiguration extends React.Component {
    constructor(props) {
        super(props);

        let timeOptions = this.props.timeOptions;
        this.state = {timeOptions};
    }

    setTime(time) {
        this.props.setTime(time);
    }

    getOption(option, index, clickHandler, selected) {
        let className = selected ? 'option selected' : 'option';
        return <span key={index} className={className} onClick={clickHandler}>{option}</span>
    }

    render() {
        return (
            <div className="TestConfiguration">
                <div className="config-row time">
                    <span>time: </span>
                    {this.state.timeOptions.map((option, index) => this.getOption(option, index, () => this.setTime(option), this.props.time === option))}
                </div>
            </div>
        );
    }
}