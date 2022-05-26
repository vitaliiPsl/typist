import React from "react";
import testService from "../../../services/test.service";
import Modal from "../../modal/Modal";
import {MainContext} from "../../app/MainContext";

export default class ResetTests extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        this.state = {showModal: false};
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    showModal(){
        this.setState({showModal: true});
    }

    hideModal(){
        this.setState({showModal: false});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.resetTests();
    }

    async resetTests(){
        let response = await testService.resetTests();
        console.log(response);

        if (!response.ok) {
            this.context.handleError(response);
            return;
        }

        this.hideModal();
    }

    render() {
        return (
            <>
                {this.state.showModal &&
                    <Modal title={'Change nickname'} cancel={this.hideModal} submit={this.handleSubmit}>
                        <div className="form-row">
                            <div className="form-row">
                                <span>Are you sure you wanna delete taken tests?</span>
                            </div>
                        </div>
                    </Modal>
                }

                <div className="settings-option-row">
                    <div className="option-description">
                        <h4>Reset tests</h4>
                    </div>
                    <div className="option-action">
                        <button onClick={this.showModal}>Reset tests</button>
                    </div>
                </div>
            </>
        );
    }
}