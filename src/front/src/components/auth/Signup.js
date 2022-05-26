import React from "react";
import "./Auth.css";
import authService from '../../services/auth.service'
import {withRouter} from "../../WithRouter";
import {MainContext} from "../app/MainContext";

class Signup extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        let form = e.target;
        let nickname = form.nickname.value;
        let email = form.email.value;
        let password = form.password.value;

        this.signUp(nickname, email, password);
    }

    async signUp(nickname, email, password) {
        let response = await authService.signUp({nickname, email, password});

        if(!response.ok){
            this.context.handleError(response);
            return;
        }

        this.props.navigate('/login');
    }

    render() {
        return (
            <div className="Auth Signup">
                <h1>Sign up</h1>

                <form onSubmit={this.handleSubmit}>
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