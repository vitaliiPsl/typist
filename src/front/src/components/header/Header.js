import React from "react";
import './Header.css'
import {NavLink, Router} from "react-router-dom";

export default class Header extends React.Component {
    constructor(props) {
        super(props);

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
                </div>
            </div>
        );
    }
}