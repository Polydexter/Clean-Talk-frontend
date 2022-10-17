import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <ul style={{'display':'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'listStyle':'none'}}>
        <li><Link to='chat'><h1>CleanTalk</h1></Link></li>
        <li><Link to='register'>Register</Link></li>
        <li><Link to='login'>Login</Link></li>
      </ul>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default Navbar