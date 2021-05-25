import logo from './logo.svg';
import './App.css';
import axios from "axios";
import {Switch, BrowserRouter as Router, Route} from "react-router-dom";
import React from "react";
import Login from "./componenets/login/login"
import Register from "./componenets/register/register";
import Nav from "./componenets/nav/nav"

function App() {
    axios.defaults.headers = {
        "Content-Type": "application/json"
    }

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" exact component={Login}/>
                    <Route path="/login" exact component={Login}/>
                </Switch>
                <Switch>
                    <Route path="/api/register" exact component={Register}/>
                </Switch>
                <Switch>
                    <Route path="/api/nav" exact component={Nav} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
