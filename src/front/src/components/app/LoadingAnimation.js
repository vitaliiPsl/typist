import React from "react";

export default class LoadingAnimation extends React.Component{
    render(){
        return(
            <div className="LoadingAnimation">
                <div className="spinner-box">
                    <div className="spinner"></div>
                </div>

                <div className="loading-box">
                    <h2 className={"loading-text"}>
                        Loading...
                    </h2>
                </div>
            </div>
        );
    }
}