import './App.css';
import axios from "axios";
import {Switch, BrowserRouter as Router, Route} from "react-router-dom";
import React from "react";
import Login from "./componenets/login/login"
import Register from "./componenets/register/register";
import Nav from "./componenets/nav/nav"
import Welcome from "./componenets/welcome/welcome";
import Events from "./componenets/events/events";
import AddEvent from "./componenets/events/newEvent";
import SelectedEvent from "./componenets/events/selectedEvent";
import Error from "./componenets/error/undefinedError";

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
                    <Route path="/error" exact component={Error}/>
                </Switch>
                <Switch>
                    <Route
                        path="/api/welcome/"
                        exact
                        render={(props) =>
                            <React.Fragment>
                                <Nav {...props}/>
                                <Welcome {...props} />
                            </React.Fragment>
                        }
                    />
                </Switch>
                <Switch>
                    <Route
                        path="/api/events/"
                        exact
                        render={(props) =>
                            <React.Fragment>
                                <Nav {...props}/>
                                <Events {...props} />
                            </React.Fragment>
                        }
                    />
                </Switch>

                <Switch>
                    <Route
                        path="/api/event/:eventId"
                        exact
                        render={(props) =>
                            <React.Fragment>
                                <Nav {...props}/>
                                <SelectedEvent {...props} />
                            </React.Fragment>
                        }
                    />
                </Switch>
                <Switch>
                    <Route
                        path="/api/addEvent/"
                        exact
                        render={(props) =>
                            <React.Fragment>
                                <Nav {...props}/>
                                <AddEvent {...props} />
                            </React.Fragment>
                        }
                    />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
