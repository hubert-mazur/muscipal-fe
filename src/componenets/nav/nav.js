import React, {useEffect, useState} from "react";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import {AccountCircle, ExitToApp, Home} from "@material-ui/icons";
import "./nav.css"

function Nav(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    function logout(event) {
        event.preventDefault();
        localStorage.setItem('auth-token', null);
        props.history.push('/login');
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/person/identity', {
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': localStorage.getItem('auth-token')
                        }
                    }
                );

                setUser(response.data);

            } catch (err) {
                if (err && err.response && err.response.status == 403)
                    props.history.push('/login');
                else if (err.response)
                    setError(err.response.data.message);
                else
                    props.history.push('/error');
            }
        };
        getData();
    }, [])

    return (
        <div className={"sidebar"}>
            {error && (
                <Alert severity={"error"} onClick={event => {
                    setError(null);
                }}>{error}</Alert>
            )}

            <table style={{borderSpacing: 20}}>
                <tbody>
                <tr>
                    <td>
                        <AccountCircle/> {user && user.firstName} {user && user.lastName}
                    </td>
                </tr>
                <tr>
                    <td onClick={event => props.history.push('/api/welcome')}>
                        <Home/> Main page
                    </td>
                </tr>

                <tr>
                    <td onClick={event => logout(event)}>
                        <ExitToApp/> {"Logout"}
                    </td>
                </tr>
                <tr>
                    <td onClick={event => props.history.push('/api/events')}>
                        Events
                    </td>
                </tr>
                <tr>
                    <td onClick={event => props.history.push('/api/addEvent')}>
                        Add event
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Nav;