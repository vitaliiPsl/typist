import React from "react";
import userService from "../../../services/user.service";
import Modal from "../../modal/Modal";
import authService from "../../../services/auth.service";
import {MainContext} from "../../app/MainContext";

export default class ChangeNickname extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        this.state = {showModal: false};
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    showModal() {
        this.setState({showModal: true});
    }

    hideModal() {
        this.setState({showModal: false});
    }

    handleSubmit(e) {
        e.preventDefault();

        let form = e.target;
        let nickname = form.nickname.value;

        this.changeNickname(nickname);
    }

    async changeNickname(nickname) {
        let response = await userService.changeNickname(nickname);
        console.log(response);

        if (!response.ok) {
            this.context.handleError(response);
            return;
        }

        let user = this.context.user;
        user.nickname = nickname;

        authService.saveCurrentUser(user);
        this.context.setUser(user);

        this.hideModal();
    }

    render() {
        return (
            <>
                {this.state.showModal &&
                    <Modal title={'Change nickname'} cancel={this.hideModal} submit={this.handleSubmit}>
                        <div className="form-row">
                            <input type="text" name="nickname" placeholder="Nickname" autoComplete="off" required/>
                        </div>
                    </Modal>
                }

                <div className="settings-option-row">
                    <div className="option-description">
                        <h4>Change nickname</h4>
                    </div>
                    <div className="option-action">
                        <button onClick={this.showModal}>Change nickname</button>
                    </div>
                </div>
            </>
        );
    }
}