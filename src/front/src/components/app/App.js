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
import Error404 from "../errorPages/Error404";
import { MainContext } from "./MainContext";

class App extends React.Component {
    constructor(props) {
        super(props);

        let user = authService.loadCurrentUser();
        this.state = {
            user: user,
            setUser: this.setUser,
            removeUser: this.removeUser,
            errors: []
        };

        this.removeError = this.removeError.bind(this);
    }

    setUser = (user) => {
        this.setState({user: user});
    }

    removeUser = () => {
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
            <MainContext.Provider value={this.state}>
                <div className="App">
                    <div className="container">
                        <ErrorsBox errors={this.state.errors} removeError={this.removeError}/>
                        <Header title={'Typist'}/>
                        <div className="Main">
                            <Routes>
                                <Route path={'/'} element={<Test addError={this.state.addError}/>}/>
                                <Route path={'/login'} element={<Login addError={this.addError}/>}/>
                                <Route path={'/signup'} element={<Signup addError={this.addError}/>}/>
                                <Route path={'/user/:id'} element={<Profile/>}/>
                                <Route path={'/*'} element={<Error404/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
            </MainContext.Provider>
        );
    }
}

export default App;
