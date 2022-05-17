import React from "react";
import "./Auth.css";
import authService from '../../services/auth.service'
import {withRouter} from "../../WithRouter";

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

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
        console.log(response);

        if(!response.ok){
            this.handleErrors(response);
            return;
        }

        this.props.navigate('/login');
    }

    async handleErrors(response){
        if(response.status === 400){
            let apiError = await response.json();
            console.log(apiError);

            if(apiError.subErrors.length === 0){
                this.props.addError(apiError.message)
            } else{
                for(let subError of apiError.subErrors){
                    this.props.addError(subError.message);
                }
            }
        }
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
                        <input type="text" name="email" placeholder="Email" autoComplete="off" required/>
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