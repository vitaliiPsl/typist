import React from "react";

export default class Overlay extends React.Component{


    render(){
        return (
            <div className="Overlay">
                {this.props.children}
            </div>
        );
    }
}