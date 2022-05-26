import React from "react";
import './Settings.css';
import UserSettings from "./user/UserSettings";

export default class Settings extends React.Component{
    render() {
        return(
            <div className="Settings">
                <div className="settings-box user-settings">
                    <h2 className={'settings-box-title'}>User settings</h2>
                    <UserSettings/>
                </div>
            </div>
        );
    }
}