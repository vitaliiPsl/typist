import React from "react";
import './Profile.css';
import {withRouter} from "../../WithRouter";
import userService from "../../services/user.service";
import TestsTable from "./TestsTable";
import TestsChart from "./TestChart";
import UserInfo from "./UserInfo";
import {MainContext} from "../app/MainContext";

class Profile extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        let id = this.props.params.id;
        this.state = {id};
    }

    componentDidMount() {
        this.context.setLoading(true);
        this.loadUser(this.state.id);
    }

    setUser(user) {
        this.setState({user: user});
    }

    async loadUser(id) {
        let response = await userService.loadUser(id);

        if (!response.ok) {
            this.context.handleError(response);
            return;
        }

        let user = await response.json();
        user.image = await userService.getImageUrl(user.image);

        this.setUser(user);
        this.context.setLoading(false);
    }

    render() {
        return (
            <div className="Profile">
                {this.state.user &&
                    <>
                        <UserInfo user={this.state.user}/>
                        {this.state.user.tests.length > 0 &&
                            <>
                                <TestsChart tests={this.state.user.tests}/>
                                <TestsTable tests={this.state.user.tests}/>
                            </>
                        }
                        {!this.state.user.tests.length > 0 &&
                            <div className="no-tests">
                                <h2>No tests to show</h2>
                            </div>
                        }
                    </>
                }
            </div>
        );
    }
}

export default withRouter(Profile);