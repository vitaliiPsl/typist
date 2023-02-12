import React from "react";
import {MainContext} from "../app/MainContext";

export default class RankingTable extends React.Component {
    static contextType = MainContext;

    getTableRow(test, index) {
        if (test === null) {
            return <tr key={index}>{this.getRankingRecord(index)}</tr>
        }

        let user = this.context.user;
        let isCurrent = user ? user.id === test.user.id : false;

        return <tr key={index} onClick={() => this.props.redirectToUser(test.user.id)} className={isCurrent ? 'current' : ''}>
            {this.getRankingRecord(index, test.user.nickname, test.wpm, test.accuracy)}
        </tr>;
    }

    getRankingRecord(index, nickname='--', wpm='--', accuracy='--') {
        return (
            <>
                <td><span className={`index _${index + 1}`}>{index + 1}</span></td>
                <td>{nickname}</td>
                <td>{wpm}</td>
                <td>{accuracy}</td>
            </>
        );
    }

    render() {
        return (
            <div className="RankingTable">
                <table>
                    <thead>
                    <tr>
                        <td>{"#"}</td>
                        <td>{"user"}</td>
                        <td>{"wpm"}</td>
                        <td>{"accuracy"}</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.tests.map((test, index) => this.getTableRow(test, index))
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}