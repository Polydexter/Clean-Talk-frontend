import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Login = () => {

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user, login } = useContext(AuthContext);

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
        navigate("/");
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

  return (
    <Row className='justify-content-center'>
      <Col lg={6} sm={8} xs={12}>
        <h3 className='text-center'>Sing in to your account</h3>
        { error && <Alert>{error}</Alert>}
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId='loginEmail' className='mb-3'>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              value={formik.values.email}
              onChange={formik.handleChange}
              type='email'
              name='email'
              placeholder='Email'
            />
          </Form.Group>
          <Form.Group controlId='loginPassword' className='mb-3'>
            <Form.Label>Password: </Form.Label>
            <Form.Control
              value={formik.values.password}
              onChange={formik.handleChange}
              type="password"
              name='password'
              placeholder='password'
            />
          </Form.Group>
          <div className='d-grid'>
            <Button
            variant='light'
            type='submit'
            >
              { formik.isSubmitting ? "Signing in..." : "Sign in" }
            </Button> 
          </div>
        </Form>
        <div className='text-center my-1'>
          Do not have an account? <Link to="/register">Sign up!</Link>
        </div>
      </Col>
    </Row>
  )
}

export default Login