import React from "react";
import './App.css';
import Header from "../header/Header";
import {Route, Routes} from "react-router-dom";
import Test from "../test/Test";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import ErrorsBox from "../errors/ErrorsBox";
import Profile from "../profile/Profile";
import authService from "../../services/auth.service";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {user: null, errors: []}

        this.setUser = this.setUser.bind(this);
        this.addError = this.addError.bind(this);
        this.removeError = this.removeError.bind(this);
    }

    componentDidMount() {
        this.setState({user: authService.loadCurrentUser()});
    }

    setUser(user) {
        this.setState({user: user});
    }

    removeUser(){
        this.setState({user: null});
    }

    addError(error) {
        let errors = this.state.errors;
        errors.push(error);

        this.setState({errors: errors});
    }

    removeError(index) {
        let errors = this.state.errors;
        errors.splice(index, 1);

        this.setState({errors: errors});
    }

    render() {
        return (
            <div className="App">
                <div className="container">
                    <ErrorsBox errors={this.state.errors} removeError={this.removeError}/>
                    <Header title={'Typist'} user={this.state.user} removeUser={this.removeUser}/>

                    <div className="Main">
                        <Routes>
                            <Route path={'/'} element={<Test addError={this.state.addError}/>}/>
                            <Route path={'/login'} element={<Login setUser={this.setUser} addError={this.addError}/>}/>
                            <Route path={'/signup'} element={<Signup addError={this.addError}/>}/>
                            <Route path={'/user/:id'} element={<Profile/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
