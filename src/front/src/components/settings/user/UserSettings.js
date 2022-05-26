import React from "react";
import ChangeNickname from "./ChangeNickname";
import ChangePassword from "./ChangePassword";
import ResetTests from "./ResetTests";
import DeleteAccount from "./DeleteAccount";

export default class UserSettings extends React.Component{

    render(){
        return (
            <div className="UserSettings">
                <ChangeNickname/>
                <ChangePassword/>
                <ResetTests/>
                <DeleteAccount/>
            </div>
        );
    }
}