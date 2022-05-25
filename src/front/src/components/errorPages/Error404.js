import React from "react";
import {NavLink} from "react-router-dom";
import './ErrorPage.css';

export default class Error404 extends React.Component{
    render(){
        return (
            <div className="ErrorPage">
                <span className="error-code">404</span>
                <h2 className="error-message">Oops... It Seems like the page you're looking for doesn't exist</h2>
                <NavLink to={'/'} className={'home-link'}>
                    <span>Go home</span>
                </NavLink>
            </div>
        );
    }
}