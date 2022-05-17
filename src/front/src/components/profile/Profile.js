import React from "react";
import './Profile.css';
import {withRouter} from "../../WithRouter";
import userService from "../../services/user.service";
import TestsTable from "./TestsTable";
import TestsChart from "./TestChart";
import UserInfo from "./UserInfo";

class Profile extends React.Component {
    constructor(props) {
        super(props);

        let id = this.props.params.id;
        this.state = {id};
    }

    componentDidMount() {
        this.loadUser(this.state.id);
    }

    setUser(user) {
        this.setState({user: user});
    }

    async loadUser(id) {
        let response = await userService.loadUser(id);
        if (response.status !== 200) {
            this.handleError(response);
            return;
        }

        let user = await response.json();
        this.setUser(user);
    }


    handleError(response) {
        if (response.status === 404)
            this.props.navigate('/notfound');
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
                                <h2>No test to show</h2>
                            </div>
                        }
                    </>
                }
            </div>
        );
    }
}

export default withRouter(Profile);