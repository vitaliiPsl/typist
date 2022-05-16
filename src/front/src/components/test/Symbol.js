import React from "react";

export default class Symbol extends React.Component {

    render() {
        return (
            <span className={this.props.type ? `Symbol ${this.props.type}` : 'Symbol'}>
                {this.props.children}
            </span>
        );
    }
}