import React from "react";
import './App.css';
import Header from "../header/Header";
import {Route, Routes} from "react-router-dom";
import Test from "../test/Test";

class App extends React.Component {


    render() {
        return (
            <div className="App">
                <div className="container">
                    <Header title={'Typist'}/>

                    <div className="Main">
                        <Routes>
                            <Route path={'/'} element={<Test/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
