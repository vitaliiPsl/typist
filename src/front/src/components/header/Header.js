import React from "react";
import './Header.css'
import {NavLink, Router} from "react-router-dom";
import authService from "../../services/auth.service";
import {withRouter} from "../../WithRouter";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleLogOut(e){
        authService.logout();
        this.props.removeUser();

        e.preventDefault();
        this.props.navigate('/');
    }

    render() {
        return (
            <div className="Header">
                <div className="title-box">
                    <NavLink to={'/'}>
                        <h1 className="title">{this.props.title}</h1>
                    </NavLink>
                </div>

                <div className="menu-box">
                    <div className="menu-item home">
                        <NavLink to={'/'} className={'menu-link'}>
                            <span>Home</span>
                        </NavLink>
                    </div>

                    {!this.props.user &&
                        <>
                            <div className="menu-item">
                                <NavLink to={'/login'} className={'menu-link'}>
                                    <span>Log in</span>
                                </NavLink>
                            </div>
                            <div className="menu-item">
                                <NavLink to={'/signup'} className={'menu-link'}>
                                    <span>Sign up</span>
                                </NavLink>
                            </div>
                        </>
                    }

                    {this.props.user &&
                        <>
                            <div className="menu-item">
                                <NavLink to={`/user/${this.props.user.id}`} className={'menu-link'}>
                                    <span>{this.props.user.nickname}</span>
                                </NavLink>
                            </div>
                            <div className="menu-item">
                                <NavLink onClick={this.handleLogOut} to={`/logout`} className={'menu-link'}>
                                    <span>Log out</span>
                                </NavLink>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Header);