import {Button, Checkbox, TextareaAutosize, TextField} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Alert, Autocomplete} from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import axios from "../axios";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function AddEvent(props) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [chosenPeople, setChosenPeople] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(
                    'api/person', {
                        headers: {
                            'auth-token': localStorage.getItem('auth-token')
                        }
                    }
                );
                setUsers(response.data);

            } catch (err) {
                if (err.response.status == 403)
                    props.history.push('/login');
                setError(err.response.data.message);
            }
        };
        getData();
    }, [])

    async function handleSubmit(event) {
        event.preventDefault();
        let data = {
            title: title,
            description: description,
            participants: chosenPeople
        }
        try {
            const response = await axios.post('api/event', JSON.stringify(data), {
                headers: {
                    'auth-token': localStorage.getItem('auth-token')
                }
            })
            console.log(response);
            props.history.push('/api/events');
        } catch (ex) {
            console.error("HERE")
            setError(ex.response.data.message);
            console.error(ex)
        }
    }

    function validateTextArea() {
        return title !== "" && description !== "";
    }

    return (<div>
        {
            error && (<Alert severity="error" onClick={(event) => {
                setError(null);
            }}>
                {error}
            </Alert>)
        }
        <form noValidate autoComplete="off" className="form" onSubmit={handleSubmit}>
            <TextField id="title" label={"event title"} type="text" onChange={(event) => {
                setTitle(event.target.value);
            }}>
            </TextField>

            <TextareaAutosize id={"description"} label={"description"} placeholder={"event description"}
                              onChange={(event) => {
                                  setDescription(event.target.value);
                              }}>
            </TextareaAutosize>

            {users && (    <Autocomplete
                multiple
                id="chosenPeople"
                options={users}
                onChange={(event, value) => setChosenPeople( value.map(val => val.id))}
                disableCloseOnSelect
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                renderOption={(option, { selected }) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {`${option.firstName} ${option.lastName}`}
                    </React.Fragment>
                )}
                style={{ width: 500 }}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Choose people to be invited" />
                )}
            />)}

            <Button type="submit" disabled={!validateTextArea()}>Add event</Button>

        </form>
    </div>)
}


export default AddEvent;