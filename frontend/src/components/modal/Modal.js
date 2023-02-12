import React from "react";
import Overlay from "../app/Overlay";
import './Modal.css';

export default class Modal extends React.Component {

    render() {
        return (
            <Overlay>
                <div className="Modal">
                    <h1 className="title">{this.props.title}</h1>
                    <form onSubmit={this.props.submit}>
                        {this.props.children}
                        <div className="form-row">
                            <button type="cancel" onClick={this.props.cancel}>Cancel</button>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </Overlay>
        );
    }
}