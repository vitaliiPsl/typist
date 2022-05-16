import React from "react";

export default class Token extends React.Component{


    render(){
        if(this.props.current) {
            return <div className={this.props.type ? `Token current ${this.props.type} ` : 'Token current'}>{this.props.children}</div>
        } else {
            return <div className={this.props.type ? `Token ${this.props.type}` : 'Token'}>{this.props.children}</div>
        }
    }
}