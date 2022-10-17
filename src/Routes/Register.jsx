import React, { useState, useEffect, useRef } from 'react'

const Register = () => {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user, password, confirmPassword)
  }

  return (
    <div>
        <h3>Register</h3>
        <form onSubmit={handleSubmit} style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}}>
            <label htmlFor='username'>
              Username: <br />
              <input
                id='username'
                type='text'
                onChange={(e) => setUser(e.target.value)}
                value={user}
                autoComplete='off'
                required
              />
            </label>
            <label htmlFor='password'>
              Password: <br />
              <input
                id='password'
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </label>
            <label htmlFor='confirm-password'>
              Confirm Password: <br />
              <input
                id='confirm-password'
                type='password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </label>
            <button type='submit'>Sign Up</button>
        </form>
    </div>
  )
}

export default Register