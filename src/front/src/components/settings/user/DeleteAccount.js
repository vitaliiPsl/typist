import React from "react";
import userService from "../../../services/user.service";
import authService from "../../../services/auth.service";
import Modal from "../../modal/Modal";
import {MainContext} from "../../app/MainContext";

export default class DeleteAccount extends React.Component {
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

        this.deleteAccount();
    }

    async deleteAccount(){
        let response = await userService.deleteAccount();

        if (!response.ok) {
            this.context.handleError(response);
            return;
        }

        authService.logout();
        this.hideModal();
    }

    render() {
        return (
            <>
                {this.state.showModal &&
                    <Modal title={'Change nickname'} cancel={this.hideModal} submit={this.handleSubmit}>
                        <div className="form-row">
                            <div className="form-row">
                                <span>Are you sure you wanna delete your account?</span>
                            </div>
                        </div>
                    </Modal>
                }

                <div className="settings-option-row">
                    <div className="option-description">
                        <h4>Delete account</h4>
                    </div>
                    <div className="option-action">
                        <button onClick={this.showModal}>Delete account</button>
                    </div>
                </div>
            </>
        );
    }
}