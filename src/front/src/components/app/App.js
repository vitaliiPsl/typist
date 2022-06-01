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
import {MainContext} from "./MainContext";
import Settings from "../settings/Settings";
import Error500 from "../errorPages/Error500";
import {withRouter} from "../../WithRouter";
import LoadingAnimation from "./LoadingAnimation";

class App extends React.Component {
    constructor(props) {
        super(props);

        let user = authService.loadCurrentUser();
        this.state = {
            user: user,
            setUser: this.setUser,
            removeUser: this.removeUser,
            errors: [],
            handleError: this.handleApiError,
            isLoading: false,
            setLoading: this.setLoading,
        };
    }

    setUser = (user) => {
        this.setState({user: user});
    }

    removeUser = () => {
        this.setState({user: null});
    }

    handleApiError = async (response) => {
        if (response.status !== 400 && response.status !== 403 && response.status !== 404) {
            this.props.navigate('/error/internal');
            return;
        }

        if (response.status === 404) {
            this.props.navigate('/error/notfound');
            return;
        }

        let apiError = await response.json();
        if (apiError.subErrors.length === 0) {
            this.addError(apiError.message)
        } else {
            for (let subError of apiError.subErrors) {
                this.addError(subError.message);
            }
        }
    }

    addError = (error) => {
        let errors = this.state.errors;
        errors.push(error);

        this.setState({errors: errors});
    }

    removeError = (index) => {
        let errors = this.state.errors;
        errors.splice(index, 1);

        this.setState({errors: errors});
    }

    setLoading = (isLoading) => {
        this.setState({isLoading});
    }

    render() {
        return (
            <MainContext.Provider value={this.state}>
                <div className="App">
                    <div className="container">
                        <ErrorsBox errors={this.state.errors} removeError={this.removeError}/>
                        <Header title={'Typist'}/>

                        {this.state.isLoading &&
                            <LoadingAnimation/>
                        }

                        <div className="Main">
                            <Routes>
                                <Route path={'/'} element={<Test/>}/>
                                <Route path={'/login'} element={<Login/>}/>
                                <Route path={'/signup'} element={<Signup/>}/>
                                <Route path={'/settings'} element={<Settings/>}/>
                                <Route path={'/user/:id'} element={<Profile/>}/>
                                <Route path={'/error/internal'} element={<Error500/>}/>
                                <Route path={'/error/notfound'} element={<Error404/>}/>
                                <Route path={'/*'} element={<Error404/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
            </MainContext.Provider>
        );
    }
}

export default withRouter(App);
