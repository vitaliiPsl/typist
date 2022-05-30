import React from "react";
import Token from "./Token";

export default class TestTokens extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            tokensPerLine: 12,
            linesOnScreen: 5,
        }
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.windowResize());
        setTimeout(() => this.windowResize(), 0);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.windowResize();
    }

    windowResize(){
        let testTokens = document.querySelector('.TestTokens');
        let tokensBoxWidth = testTokens.offsetWidth;

        let tokensWrapper = document.querySelector('.tokens-wrapper');
        let tokensWrapperWidth = tokensWrapper.offsetWidth;

        console.log(testTokens);
        console.log(tokensWrapper);
        console.log(tokensBoxWidth);
        console.log(tokensWrapper.clientWidth);

        let tokensBoxPadding = 32;
        let averWordLength = 150;

        if(tokensWrapperWidth >= tokensBoxWidth - tokensBoxPadding) {
            this.setState({tokensPerLine: this.state.tokensPerLine - 1});
        } else if(tokensBoxWidth - tokensWrapperWidth > averWordLength){
            this.setState({tokensPerLine: this.state.tokensPerLine + 1});
        }
    }

    getTokenLines(){
        let tokens = this.props.tokens;
        let currentToken = this.props.current;
        let tokensPerLine = this.state.tokensPerLine;
        let lines = [];
        let line = [];

        let currentLine = Math.floor(currentToken / tokensPerLine);

        for(let i = 0; i < tokens.length; i++){
            if(i % tokensPerLine === 0 && i !== 0){
                lines.push(line);
                line = [];
            }

            line.push(this.getToken(tokens[i], i));
        }

        return this.getPartOfLines(currentLine, lines);
    }

    getPartOfLines(currentLine, lines) {
        let linesOnScreen = this.state.linesOnScreen;
        let lowerBound = 0;
        let upperBound = linesOnScreen;

        if (currentLine >= linesOnScreen / 2) {
            lowerBound = currentLine - Math.floor(linesOnScreen / 2);
            upperBound = currentLine + Math.ceil(linesOnScreen / 2);
        }

        return lines.slice(lowerBound, upperBound);
    }

    getToken(token, index){
            return <Token key={index} current={this.props.current === index} type={this.props.wrongTokens.includes(index) && 'wrong'}>{token}</Token>
    }

    render(){
        return(
            <div className="TestTokens">
                <div className="tokens-wrapper">
                    {
                        this.getTokenLines().map((line, index) => <div className="tokens-line" key={index}>{line}</div>)
                    }
                </div>
            </div>
        );
    }
}