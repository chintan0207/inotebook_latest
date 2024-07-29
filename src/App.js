import './App.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';
import User from './components/User';

function App() {

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  }


  return (
    <>
      <NoteState>
        <Router>
          <Navbar name="iNotebook" />
          <Alert alert={alert} />
            <Routes>
              <Route path="/" element={<Home showAlert={showAlert}/>} />
              <Route path="/user" element={<User/>} />
              <Route path="/about" element={<About showAlert={showAlert} />} />
              <Route path="/login" element={<Login showAlert={showAlert}/>} />
              <Route path="/signup" element={<Signup showAlert={showAlert}/>} />

            </Routes>

        </Router>
      </NoteState>
    </>
  );
}

export default App;
