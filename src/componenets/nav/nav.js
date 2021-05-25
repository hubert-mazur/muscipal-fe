import React, {useEffect, useState} from "react";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import {AccountCircle, ExitToApp} from "@material-ui/icons";

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
                setError(err.response.data.message);
            }
        };
        getData();
    }, [])

    return (
        <div className={"sideBar"}>
            {error && (
                <Alert severity={"error"} onClick={event => {
                    setError(null);
                }}>{error}</Alert>
            )}

            <table style={{borderSpacing: 20}}>
                <tr>
                    <td>
                        <AccountCircle/> {user && user.firstName} {user && user.lastName}
                    </td>
                </tr>
                <tr>
                    <td>
                        <ExitToApp onClick={event => logout(event)}/> {"Logout"}
                    </td>
                </tr>
            </table>
        </div>
    )
}

export default Nav;