import React from "react";
import './LoadingAnimation.css';

export default class LoadingAnimation extends React.Component{
    render(){
        return(
            <div className="LoadingAnimation">
                <div className="spinner-box">
                    <div className="spinner"></div>
                </div>

                <div className="loading-box">
                    <span className={"loading-text"}>
                        Loading...
                    </span>
                </div>
            </div>
        );
    }
}