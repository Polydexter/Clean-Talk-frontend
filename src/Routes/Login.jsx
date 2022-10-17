import React, { useState } from 'react'

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(username);
    console.log(password);
    setUsername('');
    setPassword('');
  }

  return (
    <div>
        <h3>Login</h3>
        <form onSubmit={handleSubmit} style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}}>
          <label htmlFor='username'>Username: <br />
            <input
              id='username'
              type="text"
              onChange={handleUsernameChange}
              value={username}
              required
              autoComplete='off'
            />
          </label>
          <label htmlFor='password'>Password: <br />
            <input
              id='password'
              type="password"
              onChange={handlePasswordChange}
              value={password}
              required
              autoComplete='off'
            />
          </label>
          <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default Login
