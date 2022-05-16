import React from "react";
import Token from "./Token";

export default class TestTokens extends React.Component{
    constructor(props) {
        super(props);

    }

    render(){
        return(
            <div className="TestTokens">
                {
                    this.props.tokens.map((token, index) => {
                       return <Token key={index} current={this.props.current === index} type={this.props.wrongTokens.includes(index) && 'wrong'}>{token}</Token>
                    })
                }
            </div>
        );
    }
}