import React from "react";
import {NavLink} from "react-router-dom";
import './ErrorPage.css';

export default class Error500 extends React.Component{
    render(){
        return (
            <div className="ErrorPage">
                <span className="error-code">500</span>
                <h2 className="error-message">Sorry... Something went wrong</h2>
                <NavLink to={'/'} className={'home-link'}>
                    <span>Go home</span>
                </NavLink>
            </div>
        );
    }
}