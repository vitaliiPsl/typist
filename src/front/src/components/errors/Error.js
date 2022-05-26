import React from "react";

export default class Error extends React.Component {
    constructor(props) {
        super(props);

        this.removeError = this.removeError.bind(this);
    }

    componentDidMount() {
        setInterval(() => this.removeError(), 10000);
    }

    removeError(){
        this.props.removeError(this.props.index);
    }

    render() {
        return (
            <div className="Error">
                <h5>{this.props.error}</h5>
                <div className="close" onClick={this.removeError}/>
            </div>
        );
    }
}