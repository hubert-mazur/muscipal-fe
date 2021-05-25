import React, {useState} from "react";
import {Alert} from "@material-ui/lab";
import {TextField, Button} from "@material-ui/core";
import "./style.css";
import axios from "axios";

export default function (props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    function validateForm() {
        return firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await axios.post(
                "http://localhost:8080/api/register",
                JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            );
            props.history.push("/login");
        } catch (err) {
            console.error(err)
            setError(err.toString());
        }
    }

    return (
        <div className="Register">
            {
                error && (<Alert severity="error" onClick={(event) => {
                    setError(null);
                }}>
                    {error}
                </Alert>)
            }

            <form noValidate autoComplete="off" className="form" onSubmit={handleSubmit}>
                <TextField id="firstName" label={"First name"} type="text" onChange={(event) => {
                    setFirstName(event.target.value);
                }}>
                </TextField>
                <TextField id="lsatName" label={"Last name"} type="text" onChange={(event) => {
                    setLastName(event.target.value);
                }}>
                </TextField>
                <TextField id="email" label={"email"} type="email" onChange={(event) => {
                    setEmail(event.target.value);
                }}>
                </TextField>

                <TextField id={"password"} label={"password"} type="password" onChange={(event) => {
                    setPassword(event.target.value);
                }}>
                </TextField>
                <Button type="submit" disabled={!validateForm()}>Login</Button>
            </form>
        </div>
    )
}