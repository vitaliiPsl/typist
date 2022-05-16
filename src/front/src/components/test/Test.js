import React from "react";
import './Test.css'
import textService from "../../services/text.service";
import testService from '../../services/test.service'
import TestTokens from "./TestTokens";
import Symbol from "./Symbol";
import TestResult from "./TestResult";


const TEST_STATUS_NOT_STARTED = 'not started';
const TEST_STATUS_IN_PROGRESS = 'in progress';
const TEST_STATUS_COMPLETE = 'complete';

export default class Test extends React.Component {
    constructor(props) {
        super(props);

        let initTime = 30;
        this.state = {
            initTime: initTime,
            time: initTime,
            text: [],
            tokens: [],
            wordCount: 0,
            status: TEST_STATUS_NOT_STARTED
        }

        this.input = React.createRef();

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.restart = this.restart.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        this.prepareTest();
    }

    prepareTest() {
        let text = this.loadText();
        let tokens = this.buildTokens(text);

        let inputTokens = [];
        let wrongTokens = [];
        let wordCount = 0;

        let time = this.state.initTime;
        let status = TEST_STATUS_NOT_STARTED;

        this.input.current.value = '';
        this.input.current.focus();

        this.setState({text, tokens, inputTokens, wrongTokens, wordCount, time, status});
    }

    start() {
        this.setState({status: TEST_STATUS_IN_PROGRESS});
        this.startTimer();
    }

    restart() {
        this.stopTimer();
        this.prepareTest();
    }

    stop() {
        this.stopTimer();
        this.input.current.blur();

        let result = testService.getTestResult(this.state.text, this.state.inputTokens, this.state.wordCount, this.state.initTime);
        this.setState({
            status: TEST_STATUS_COMPLETE,
            testResult: result
        });

        //TODO: save test result
    }

    startTimer() {
        let intervalId = setInterval(
            () => this.state.time === 0 ? this.stop() : this.setState({time: this.state.time - 1}),
            1000
        );

        this.setState({intervalId});
    }

    stopTimer() {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
    }

    loadText() {
        return textService.getWords(100);
    }

    buildTokens(text) {
        return text.map(token =>
            token.split('').map((char, index) => this.buildSymbol(char, index))
        );
    }

    buildSymbol(character, key, type = '') {
        return <Symbol key={key} type={type}>{character}</Symbol>
    }

    handleInput(e) {
        if(this.state.status !== TEST_STATUS_IN_PROGRESS){
            this.start();
        }

        let input = e.target.value;
        let index = this.state.wordCount;
        let token = this.state.text[index];
        let inputTokens = this.state.inputTokens;
        let wrongTokens = this.state.wrongTokens;

        if (input[input.length - 1] !== ' ') {
            this.updateToken(input, token, index);
        } else {
            if (input.slice(0, input.length - 1) !== token) {
                wrongTokens.push(index);
            }

            inputTokens.push(input);
            this.setState({wordCount: ++index, inputTokens: inputTokens, wrongTokens: wrongTokens})

            this.input.current.value = '';
        }
    }

    updateToken(input, token, index) {
        let inputSymbols = input.split('');
        let tokenSymbols = token.split('');
        let symbols = [];

        let i = 0;
        for (; i < inputSymbols.length && i < tokenSymbols.length; i++) {
            if (inputSymbols[i] === tokenSymbols[i]) {
                symbols.push(this.buildSymbol(tokenSymbols[i], i, "correct"));
            } else {
                symbols.push(this.buildSymbol(tokenSymbols[i], i, "mistake"));
            }
        }

        while (i < inputSymbols.length) {
            symbols.push(this.buildSymbol(inputSymbols[i], i, "excessive"));
            i++;
        }

        while (i < tokenSymbols.length) {
            symbols.push(this.buildSymbol(tokenSymbols[i], i));
            i++;
        }

        let tokens = this.state.tokens;
        tokens[index] = symbols;
        this.setState({tokens});
    }

    render() {
        return (
            <div className="Test">

                {this.state.status === TEST_STATUS_COMPLETE &&
                    <TestResult result={this.state.testResult}/>
                }

                <div className="test-timer small">{this.state.time}</div>

                <div className="control-row">
                    <input type="text" className={'test-input'} ref={this.input} onChange={this.handleInput}/>
                    <button className={'restart-btn'} onClick={this.restart}>Restart</button>
                </div>

                <TestTokens tokens={this.state.tokens} current={this.state.wordCount} wrongTokens={this.state.wrongTokens}/>
            </div>
        );
    }
}