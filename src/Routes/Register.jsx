// TODO: rewrite registration form with formik

import React, { useState } from 'react'
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
      setErr('')
      setSuccess(response.data.message);
    } catch(err) {
      setSuccess('')
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
    <Row className='justify-content-center'>
      <Col lg={6} sm={8} xs={12}>
        <h3 className='text-center'>Register</h3>
        { err && (
          <Alert variant='danger'>
            {err}
          </Alert>
        )}
        { success && (
          <Alert variant='success'>
          {success}
        </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='registerFormUsername' className='mb-3'>
            <Form.Label>Username: </Form.Label>
            <Form.Control
              placeholder='Username'
              type='text'
              onChange={(e) => setUserName(e.target.value)}
              value={username}
              autoComplete='off'
              required
            />
            <Form.Text className='text-muted'>
              Pick a unique username
            </Form.Text>
          </Form.Group>
          <Form.Group controlId='registerFormEmail' className='mb-3'>
            <Form.Label>Email: </Form.Label>
            <Form.Control
              placeholder='Email'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoComplete='off'
              required
            />
            <Form.Text className='text-muted'>
              You will need it to login 
            </Form.Text>
          </Form.Group>
          <Form.Group controlId='registerFormPassword' className='mb-3'>
            <Form.Label>Password: </Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoComplete='off'
              required
            />
            <Form.Text className='text-muted'>
              At least 4 symbols 
            </Form.Text>
          </Form.Group>
          <Form.Group controlId='registerFormConfirm' className='mb-3'>
            <Form.Label>Confirm password: </Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter your password again'
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              autoComplete='off'
              required
            />
            <Form.Text className='text-muted'>
              Fields must match
            </Form.Text>
          </Form.Group>
          <div className='d-grid'>
          <Button variant='light' type='submit' size='sm'>Sign Up</Button>
          </div>
        </Form>
      </Col>
    </Row>
  )
}

export default Register