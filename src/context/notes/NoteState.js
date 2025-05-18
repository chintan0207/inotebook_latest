import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "https://inotebook-latest.onrender.com";
  const notesIntial = [];
  const userIntial = [];
  const [notes, setNotes] = useState(notesIntial);
  const [user, setUser] = useState(userIntial);
  const [loading, setLoading] = useState(false);

  // Get user details
  const getUser = async () => {
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  };

  // Get all the Notes
  const getNotes = async () => {
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description, tag }),
      });

      const note = await response.json();
      setNotes(notes.concat(note));
    } finally {
      setLoading(false);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      console.log(json);
      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
    } finally {
      setLoading(false);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description, tag }),
      });

      const json = await response.json();
      console.log(json);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        getNotes,
        addNote,
        deleteNote,
        editNote,
        user,
        getUser,
        host,
        loading,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
