import React, { useState, useContext, useEffect } from 'react'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user, login } = useContext(AuthContext);

  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { email, password } = values;
      const response = await login(email, password);
      console.log("Outer most login (component level): ", response)
      if (response.access && response.refresh) {
        navigate("/conversations");
      }
      setSubmitting(false);
      setError('Login failed')
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user]);


  // function handleUsernameChange(e) {
  //   setUsername(e.target.value);
  // }

  // function handlePasswordChange(e) {
  //   setPassword(e.target.value);
  // }

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   console.log(username);
  //   console.log(password);
  //   setUsername('');
  //   setPassword('');
  // }

  return (
    <div>
        <h3>Sing in to your account</h3>
        { error && <h3>{error}</h3>}
        <form onSubmit={formik.handleSubmit}>
          {error && <div>{JSON.stringify(error)}</div>}

          <input
            value={formik.values.email}
            onChange={formik.handleChange}
            type='text'
            name='email'
            placeholder='email'
          />
          <input
            value={formik.values.password}
            onChange={formik.handleChange}
            type="password"
            name='password'
            placeholder='password'
          />
          <button
          type='submit'
        >
          { formik.isSubmitting ? "Signing in..." : "Sign in" }
        </button>
        </form>
    </div>
  )
}

export default Login


// Initial return value:
{/* <h3>Login</h3>
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
        </form> */}