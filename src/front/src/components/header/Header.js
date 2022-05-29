import React from "react";
import './Header.css'
import {NavLink} from "react-router-dom";
import authService from "../../services/auth.service";
import {withRouter} from "../../WithRouter";
import {MainContext} from "../app/MainContext";

class Header extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }

        this.toggleOpen = this.toggleOpen.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(){
        authService.logout();
        this.context.removeUser();

        window.location.href = '/';
    }

    toggleOpen(){
        this.setState({open: !this.state.open})
    }

    render() {
        return (
            <div className="Header">
                <div className="title-box">
                    <NavLink to={'/'}>
                        <h1 className="title">{this.props.title}</h1>
                    </NavLink>
                </div>

                <div className={this.state.open ? 'menu-box open' : 'menu-box'}>
                    <div className="menu-item home">
                        <NavLink to={'/'} className={'menu-link'}>
                            <span>Home</span>
                        </NavLink>
                    </div>

                    {!this.context.user &&
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

                    {this.context.user &&
                        <>
                            <div className="menu-item">
                                <NavLink to={`/settings`} className={'menu-link'}>
                                    <span>Settings</span>
                                </NavLink>
                            </div>
                            <div className="menu-item">
                                <NavLink to={`/user/${this.context.user.id}`} className={'menu-link'}>
                                    <span>{this.context.user.nickname}</span>
                                </NavLink>
                            </div>
                            <div className="menu-item">
                                <NavLink onClick={this.handleLogout} to={`/logout`} className={'menu-link'}>
                                    <span>Log out</span>
                                </NavLink>
                            </div>
                        </>
                    }
                </div>
                <div className="burger-menu" onClick={this.toggleOpen}>
                    <div className={this.state.open ? 'burger-icon open' : 'burger-icon'}></div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);