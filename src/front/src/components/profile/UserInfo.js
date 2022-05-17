import React from "react";

export default class UserInfo extends React.Component {

    render() {
        return (
            <div className="UserInfo">
                <div className="user-image">
                    <img src="https://images.unsplash.com/photo-1652752724192-c30c33e90ea6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt=""/>
                </div>
                <div className="user-data">{this.props.user.nickname}</div>
            </div>
        );
    }
}