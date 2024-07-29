import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
    const host = "https://inotebook-latest.onrender.com";
    const notesIntial = [];
    const userIntial = [];
    const [notes, setNotes] = useState(notesIntial);
    const [user, setUser] = useState(userIntial);

    //get user details
    const getUser = async () => {
        const response = await fetch(`${host}/api/auth/getuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
        });
        if (response.status !== 401) {
            const json = await response.json();
            setUser(json);
        }
    };
    //Get all the Notes
    //Add a Note
    const getNotes = async () => {
        //todo: api call

        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
        });
        if (response.status !== 401) {
            const json = await response.json();
            setNotes(json);
        }
    };

    //Add a Note
    const addNote = async (title, description, tag) => {
        //todo: api call

        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
        });

        const note = await response.json();
        setNotes(notes.concat(note));
    };

    //Delete a Note
    const deleteNote = async (id) => {
        //todo: api call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
        });
        //logic of delete note
        const newNotes = notes.filter((note) => {
            return note._id !== id;
        });
        const json = await response.json();
        console.log(json);
        setNotes(newNotes);
    };

    //Edit a Note
    const editNote = async (id, title, description, tag) => {
        //api call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
        });
        const json = await response.json();
        console.log(json);

        //create copy of notes to update state
        let newNotes = JSON.parse(JSON.stringify(notes));

        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    };
    return (
        <NoteContext.Provider
            value={{ notes, getNotes, addNote, deleteNote, editNote, user, getUser }}
        >
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
