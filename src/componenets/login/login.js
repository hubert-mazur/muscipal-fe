import React, {useState} from "react";
import {Alert} from "@material-ui/lab";
import {TextField, Button} from "@material-ui/core";
import axios from "axios";
import "./style.css";

export default function (props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            let resp = await axios.post("https://still-garden-02215.herokuapp.com/api/login", JSON.stringify({
                email: email,
                password: password
            }));
            localStorage.setItem('auth-token', resp.data);

            props.history.push('/api/welcome');

        } catch (err) {
            // console.error(err)
            if (err && err.response && err.response.data)
            setError(err.response.data.message);
        }
    }

    return (
        <div className="Login">
            {
                error && (<Alert severity="error" onClick={(event) => {
                    setError(null);
                }}>
                    {error}
                </Alert>)
            }

            <form noValidate autoComplete="off" className="form" onSubmit={handleSubmit}>
                <TextField id="email" label={"email"} type="email" onChange={(event) => {
                    setEmail(event.target.value);
                }}>
                </TextField>

                <TextField id={"password"} label={"password"} type="password" onChange={(event) => {
                    setPassword(event.target.value);
                }}>

                </TextField>
                <Button type="submit" disabled={!validateForm()}>Login</Button>
                <Button onClick={(event) => {
                    props.history.push("/api/register");
                }}>Don't have an account? Register now!</Button>
            </form>
        </div>
    )
}