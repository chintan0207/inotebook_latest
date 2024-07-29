import React, { useContext, useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa';
import noteContext from '../context/notes/noteContext';


const User = () => {

    const context = useContext(noteContext);
    const {user, getUser} = context;

    useEffect(() => {
        if(localStorage.getItem('token')){
            getUser()
        }
    })

  return (
    <div>
    <div className='user-in d-flex align-items-center justify-content-start'>
        <FaUserCircle className='u-in'/>
        <h4>{user.name}</h4>
    </div>
    
        <h5 className='my-2 mx-4'>Email : {user.email} </h5>

    </div>
  )
}

export default User