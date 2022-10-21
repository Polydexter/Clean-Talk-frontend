// TODO: rewrite registration form with formik

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';

const Register = () => {

  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')

  const submitRegistration = async(username, email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/users/register/', { email, username, password });
      setSuccess(response.data.message);
    } catch(err) {
      setErr('Registration failed');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      submitRegistration(username, email, password);
    } else {
      setErr('Password fields did not match');
      return
    }
    setUserName('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
  }

  return (
    <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}}>
        <h3>Register</h3>
        { err && (
          <div style={{'color': 'red', 'fontWeight': '600'}}>
            <h3>{err}</h3>
          </div>
        )}
        { success && (
          <div style={{'color': 'green', 'fontWeight': '600'}}>
          <h3>{success}</h3>
        </div>
        )}
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>
              Username: <br />
              <input
                id='username'
                type='text'
                onChange={(e) => setUserName(e.target.value)}
                value={username}
                autoComplete='off'
                required
              />
            </label> <br />
            <label htmlFor='email'>
              Email: <br />
              <input
                id='email'
                type='text'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoComplete='off'
                required
              />
            </label> <br />
            <label htmlFor='password'>
              Password: <br />
              <input
                id='password'
                type='password'
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErr('');
                }}
                value={password}
                required
              />
            </label> <br />
            <label htmlFor='confirm-password'>
              Confirm Password: <br />
              <input
                id='confirm-password'
                type='password'
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErr('');
                }}
                value={confirmPassword}
                required
              />
            </label> <br />
            <button type='submit'>Sign Up</button>
        </form>
    </div>
  )
}

export default Register