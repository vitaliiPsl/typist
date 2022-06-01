import React from "react";

export default class UserInfo extends React.Component {

    render() {
        return (
            <div className="UserInfo">
                <div className="user-image">
                    <img src={this.props.user.image} alt=""/>
                </div>
                <div className="user-data">{this.props.user.nickname}</div>
            </div>
        );
    }
}