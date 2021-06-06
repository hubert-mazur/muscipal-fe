import React, {useEffect, useState} from "react";
import axios from "axios";
import "./event.css"
import EditEvent from "./editEvent";
import {Archive, Delete, PlaylistPlay, Settings} from "@material-ui/icons";
import {Alert} from "@material-ui/lab";

function Events(props) {

    const [events, setEvents] = useState(null);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editEvent, setEditEvent] = useState(null);

    const getData = async () => {
        try {
            const response = await axios.get(
                'https://still-garden-02215.herokuapp.com/api/event', {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            );
            setEvents(response.data);

        } catch (err) {
            // if (err.response.status == 403)
            //     props.history.push('/login');
            setError(err.response.data.message);
        }
    };

    useEffect(() => {

        getData();
    }, [])

    if (selectedEvent != null)
        props.history.push(`/api/event/${selectedEvent.id}`)

    if (editEvent != null)
        return <EditEvent event={{editEvent}}/>;

    async function archive(eventId) {
        try {
            const response = await axios.get(
                `https://still-garden-02215.herokuapp.com/api/event/${eventId}/archive`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            );
            console.log("archived");

        } catch (err) {

            setError(err.response.data.message);
        }
    }

    async function deleteEvent(eventId) {
        try {
            const response = await axios.delete(
                `https://still-garden-02215.herokuapp.com/api/event/${eventId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            );
            console.log("deleted");
            setEvents(null);
            await getData();
        } catch (err) {

            setError(err.response.data.message);
        }
    }

    return events && (
        <div className={"eventsContainer"}>
            {
                error && (<Alert severity="error" onClick={(event) => {
                    setError(null);
                }}>
                    {error}
                </Alert>)
            }
            {
                events.map((event) => {
                    return (
                        <div className={"eventDiv"} >
                            <div className={"eventDetails"}>
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                            </div>
                            <div className={"eventActionButtons"}>
                                <PlaylistPlay className={"icon"} onClick={event1 => setSelectedEvent(event)}/>
                                <Settings className={"icon"} onClick={event1 => setEditEvent(event)}/>
                                <Archive className={"icon"} onClick={event1 => archive(event.id)}/>
                                <Delete className={"icon"} onClick={event1 => deleteEvent(event.id)}/>
                            </div>

                        </div>
                    )
                })
            }
        </div>
    );
}

export default Events;