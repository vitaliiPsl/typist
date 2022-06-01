import React from "react";
import "./Auth.css";
import authService from '../../services/auth.service'
import {withRouter} from "../../WithRouter";
import {MainContext} from "../app/MainContext";
import defaultUserImage from './../../icons/user.png';

class Signup extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let profileImage = document.querySelector("#avatar-image");
        let profileImageInput = document.querySelector("#avatar-input");

        profileImage.addEventListener("click", () => {
            profileImageInput.click();
        });

        profileImageInput.addEventListener("change", () => {
            this.previewProfileImage(profileImageInput, profileImage);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        let form = e.target;
        let nickname = form.nickname.value;
        let email = form.email.value;
        let password = form.password.value;
        let avatar = form.avatar.files[0];

        this.signUp(nickname, email, password, avatar);
    }

    async signUp(nickname, email, password, avatar) {
        let response = await authService.signUp(nickname, email, password, avatar);

        if(!response.ok){
            this.context.handleError(response);
            return;
        }

        this.props.navigate('/login');
    }

    previewProfileImage(uploader, profileImage) {
        console.log("here");
        if (uploader.files && uploader.files[0]) {
            let imageFile = uploader.files[0];
            let reader = new FileReader();

            reader.onload = function (e) {
                profileImage.setAttribute('src', e.target.result);
            }
            reader.readAsDataURL(imageFile);
        }
    }

    render() {
        return (
            <div className="Auth Signup">
                <h1>Sign up</h1>

                <form onSubmit={this.handleSubmit}>
                    <div className="form-row avatar-block">
                        <div className="image-wrapper">
                            <img id="avatar-image" src={defaultUserImage} alt=""/>
                        </div>
                        <input id="avatar-input" type="file" name="avatar" accept="image/*"/>
                    </div>
                    <div className="form-row">
                        <input type="text" name="nickname" placeholder="Nickname" autoComplete="off"/>
                    </div>
                    <div className="form-row">
                        <input type="email" name="email" placeholder="Email" autoComplete="off" required/>
                    </div>
                    <div className="form-row">
                        <input type="password" name="password" placeholder="Password" required/>
                    </div>
                    <div className="form-row">
                        <button type="submit">Sign up</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(Signup);