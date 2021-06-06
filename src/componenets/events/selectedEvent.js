import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, TextField} from "@material-ui/core";
import "./event.css"
import {
    Delete,
    LocalLibrary,
    MusicNote,
    PlayCircleFilled,
    ThumbDown,
    ThumbUp
} from "@material-ui/icons";
import {Alert} from "@material-ui/lab";

function SelectedEvent(props) {

    const [event, setEvent] = useState(null);
    const [clips, setClips] = useState([]);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);
    const [link, setLink] = useState("");


    async function linkSubmit(event) {
        event.preventDefault();

        try {
            const response = await axios.put(
                `https://still-garden-02215.herokuapp.com/api/event/${props.match.params.eventId}/link`, JSON.stringify({link: link}), {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            );
            setClips([]);
            await getData();
        } catch (error) {
            // console.error(error);
            setError(error.response.data.message);
        }
    }

    function validateLink() {
        return link.match('https://www.youtube.com/watch\\?v=[a-zA-Z0-9_\-]+$') != null;
    }

    async function voteLink(linkId, upvote = true) {
        try {
            const response = await axios.patch(
                `http://localhost:8080/api/event/${props.match.params.eventId}/link/${linkId}/${upvote === true ? "upvote" : "downvote"}`, JSON.stringify({link: link}), {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            );

            // console.log("Upvote OK");
            setClips([]);
            await getData();
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteLink(linkId) {
        try {
            const response = await axios.delete(
                `https://still-garden-02215.herokuapp.com/api/event/${props.match.params.eventId}/links/${linkId}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            );

            // console.log("Delete OK");
            setClips([]);
            await getData();
        } catch (err) {
            console.error(err);
        }
    }


    const getData = async () => {
        let ev = null;
        try {
            const response = await axios.get(
                `https://still-garden-02215.herokuapp.com/api/event/${props.match.params.eventId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                }
            );

            setEvent(response.data);
            ev = response.data;
            // console.log(response.data)

        } catch (err) {
            console.error(err);
        }


        try {
            if (ev.links != null) {
                ev.links.map(async (link) => {
                    // console.log(link);
                    const response = await axios.get(
                        `https://www.youtube.com/oembed?url=${link.link}&format=json`, {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }
                    );
                    let imageURL = link.link.split("v=")[1];
                    // console.error(link);
                    response.data.link = link.link;
                    response.data.imageURL = imageURL;
                    response.data.linkId = link.id;
                    response.data.upvotes = link.upvoted;
                    response.data.downvotes = link.downvoted;
                    // console.error(response.data);
                    setClips(oldArray => [...oldArray, response.data])
                });
                setReady(true);
            }

        } catch (err) {
            console.error(err);
            setError(err.response);
        }
    };

    useEffect(() => {
        setClips([]);
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
            {
                event && <div className={"linkDiv"}>
                    <form onSubmit={linkSubmit}>
                        <TextField id={"linkField"} label={"link"} type={"text"} variant={"outlined"} size={"small"}
                                   onChange={event => setLink(event.target.value)}/>
                        <Button type={"submit"} disabled={!validateLink()}>Add link</Button>
                    </form>
                </div>
            }
            {
                event && ready &&
                <div className={"allLinks"}>
                    <h1 id={"eventTitle"}>{event.title}</h1>
                    <p id={"eventDescription"}>{event.description}</p>
                    {
                        clips.map((clip) => {
                            return (<div className={"singleLink"}>
                                    <div className={"linkImage"}>
                                        <a target={"_blank"} href={clip.link}><img
                                            src={`https://img.youtube.com/vi/${clip.imageURL}/0.jpg`}/></a>
                                    </div>
                                    <div className={"divCaption"}>
                                        <div><MusicNote className={"icon"}/> {clip.title}</div>
                                        <div><LocalLibrary className={"icon"}/> {clip.author_name}</div>
                                        <div className={"actionButtons"}>
                                            <a target={"_blank"} href={clip.link}><PlayCircleFilled
                                                className={"actionIcon"}/></a>
                                            <ThumbUp style={{color: 'green'}}
                                                     onClick={event1 => voteLink(clip.linkId, true)}/> {clip.upvotes != null ? clip.upvotes.length : 0}
                                            <ThumbDown
                                                style={{color: 'red'}}
                                                onClick={event1 => voteLink(clip.linkId, false)}/> {clip.downvotes != null ? clip.downvotes.length : 0}
                                            <Delete style={{color: "red"}} onClick={event1 => deleteLink(clip.linkId)}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}


export default SelectedEvent;