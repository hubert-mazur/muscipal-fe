import React, {useEffect, useState} from "react";
import {Button, Checkbox, TextareaAutosize, TextField} from "@material-ui/core";
import {Alert, Autocomplete} from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import axios from "axios";

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

function EditEvent(props) {
    let editingEvent = props.event.editEvent;

    const [title, setTitle] = useState(editingEvent.title);
    const [description, setDescription] = useState(editingEvent.description);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [chosenPeople, setChosenPeople] = useState([]);

    async function handleSubmit(event) {
        event.preventDefault();

        let data = {
            title: title,
            description: description,
            participants: chosenPeople.map(person => person.id)
        };

        try {
            let response = await axios.put(
                `https://still-garden-02215.herokuapp.com/api/event/${editingEvent.id}`, JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            );
            // console.log(response);

        } catch (ex) {
            setError(ex.response);
            console.error(ex.response)
        }
    }

    function validateTextArea() {
        return title !== "" && description !== "";
    }

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios.get(
                    `https://still-garden-02215.herokuapp.com/api/person`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': localStorage.getItem('auth-token')
                        }
                    }
                );
                // console.log(response.data);
                setUsers(response.data);

                response = await axios.get(
                    `https://still-garden-02215.herokuapp.com/api/event/participants/${editingEvent.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': localStorage.getItem('auth-token')
                        }
                    }
                );
                // console.error(response.data);
                setChosenPeople(response.data);


            } catch (err) {
                // if (err.response.status == 403)
                //     props.history.push('/login');
                setError(err);
            }
        };
        getData();
    }, [])


    return (
        <div>
            {
                error && (<Alert severity="error" onClick={(event) => {
                    setError(null);
                }}>
                    {error}
                </Alert>)
            }
            <form noValidate autoComplete="off" className="form" onSubmit={handleSubmit}>
            <TextField id="title" label={"event title"} type="text" value={title} onChange={(event) => {
                setTitle(event.target.value);
            }}>
            </TextField>

            <TextareaAutosize id={"description"} label={"description"} placeholder={"event description"}
                              value={description}
                              onChange={(event) => {
                                  setDescription(event.target.value);
                              }}>
            </TextareaAutosize>

            {users && chosenPeople && (<Autocomplete
                multiple
                id="chosenPeople"
                options={users}
                onChange={(event, value) => setChosenPeople(value)}
                disableCloseOnSelect
                value={chosenPeople}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                renderOption={(option, {selected}) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{marginRight: 8}}
                            checked={selected}
                        />
                        {`${option.firstName} ${option.lastName}`}
                    </React.Fragment>
                )}
                style={{width: 500}}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Choose people to be invited"/>
                )}
            />)}

            <Button type="submit" disabled={!validateTextArea()}>Add event</Button>

        </form>
        </div>
    )
}


export default EditEvent;