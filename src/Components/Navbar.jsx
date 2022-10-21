import React, { useContext, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <>
      <ul style={{'display':'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'listStyle':'none'}}>
        <li><Link to='chat'><h1>CleanTalk</h1></Link></li>
        <li><Link to='register'>Register</Link></li>
        { 
          !user ? (
            <li><Link to='login'>Login</Link></li>
            ) : (
              <>
                <span>Logged in as {user.username}</span>
                <button onClick={logout}>Logout</button>
              </>
          )}
      </ul>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default Navbar