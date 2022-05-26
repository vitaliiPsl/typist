import React from "react";
import "./Auth.css";
import authService from "../../services/auth.service";
import {withRouter} from "../../WithRouter";
import {MainContext} from "../app/MainContext";

class Login extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let form = e.target;
        let email = form.email.value;
        let password = form.password.value;

        this.logIn(email, password);
    }

    async logIn(email, password) {
        let response = await authService.login({email, password});
        console.log(response);
        if (!response.ok) {
            this.context.handleError(response);
            return;
        }

        let data = await response.json();
        let user = data.user;
        user.authToken = data.authToken;

        authService.saveCurrentUser(user);
        this.context.setUser(user);
        this.props.navigate('/')
    }

    render() {
        return (
            <div className="Auth Login">
                <h1>Log in</h1>

                <form onSubmit={this.handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="email" placeholder="Email" autoComplete="off" required/>
                    </div>
                    <div className="form-row">
                        <input type="password" name="password" placeholder="Password" required/>
                    </div>
                    <div className="form-row">
                        <button type="submit">Log in</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(Login);