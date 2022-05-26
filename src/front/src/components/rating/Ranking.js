import React from "react";
import './Ranking.css';
import Overlay from "../app/Overlay";
import testService from "../../services/test.service";
import {withRouter} from "../../WithRouter";
import RankingTable from "./RankingTable";
import {MainContext} from "../app/MainContext";

class Ranking extends React.Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        this.state = {displayTable: false, tests: [null, null, null]};

        this.redirectToUser = this.redirectToUser.bind(this);
        this.showRankingTable = this.showRankingTable.bind(this);
        this.hideRankingTable = this.hideRankingTable.bind(this);
    }

    componentDidMount() {
        this.loadTodayTests();
    }

    showRankingTable() {
        this.setState({displayTable: true});
    }

    hideRankingTable() {
        this.setState({displayTable: false});
    }

    redirectToUser(id) {
        this.hideRankingTable();

        this.props.navigate(`/user/${id}`);
    }

    async loadTodayTests() {
        let response = await testService.loadTodayTests();

        if (!response.ok) {
            this.context.handleError(response);
            return;
        }

        let todayTests = await response.json();
        todayTests.sort((test1, test2) => test2.wpm - test1.wpm);

        while(todayTests.length < 3){
            todayTests.push(null);
        }

        this.setState({tests: todayTests});
    }

    render() {
        if (!this.state.displayTable) {
            return <div className="RankingButton" onClick={this.showRankingTable}>
                <div className="icon"/>
            </div>
        } else {
            return (
                <Overlay>
                    <div className="Ranking">
                        <div className="close" onClick={this.hideRankingTable}/>
                        <h2 className="title">Today ranking</h2>
                        <RankingTable tests={this.state.tests} redirectToUser={this.redirectToUser}/>
                    </div>
                </Overlay>
            );
        }
    }
}

export default withRouter(Ranking);