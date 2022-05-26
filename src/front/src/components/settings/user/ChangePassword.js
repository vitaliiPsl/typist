import React from "react";
import userService from "../../../services/user.service";
import Modal from "../../modal/Modal";
import {MainContext} from "../../app/MainContext";

export default class ChangePassword extends React.Component {
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

        let form = e.target;
        let oldPassword = form.oldPassword.value;
        let newPassword = form.newPassword.value;

        this.changePassword(oldPassword, newPassword);
    }

    async changePassword(oldPassword, newPassword){
        let response = await userService.changePassword(oldPassword, newPassword);
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
                    <Modal title={'Change password'} cancel={this.hideModal} submit={this.handleSubmit}>
                        <div className="form-row">
                            <input type="password" name="oldPassword" placeholder="Old password" autoComplete="off" required/>
                        </div>
                        <div className="form-row">
                            <input type="password" name="newPassword" placeholder="New password" autoComplete="off" required/>
                        </div>
                    </Modal>
                }

                <div className="settings-option-row">
                    <div className="option-description">
                        <h4>Change password</h4>
                    </div>
                    <div className="option-action">
                        <button onClick={this.showModal}>Change password</button>
                    </div>
                </div>
            </>
        );
    }
}