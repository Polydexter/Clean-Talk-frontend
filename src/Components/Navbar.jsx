import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button'
import LinkContainer from 'react-router-bootstrap/LinkContainer';


const MyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { unreadMessageCount } = useContext(NotificationContext)
  useEffect(() => {
    console.log("User (Navbar level): ", user)
  }, [user])

  useEffect(() => {
    console.log("Unread messags (navbar): ", unreadMessageCount)
  }, [unreadMessageCount])


  return (
    <>
      <Navbar collapseOnSelect bg='light rounded-bottom mb-3' expand='md'>
        <Container fluid>
          <Navbar.Brand href='/'>CleanTalk</Navbar.Brand>
          <Navbar.Toggle aria-controls='chat-navbar'/>
          <Navbar.Collapse id='chat-navbar'>
          <Nav className='flex-grow-1'>
            {/* <LinkContainer to='/'>
              <Nav.Link>Users</Nav.Link>
            </LinkContainer> */}
            <LinkContainer to="/">
              <Nav.Link>Chats { unreadMessageCount && (
                    <span>{unreadMessageCount}</span>
                  )
                }</Nav.Link>
            </LinkContainer>
            { user && <Navbar.Text>Logged in as {user}</Navbar.Text>}
              { 
                !user ? (
                  <>
                  <LinkContainer to='register'>
                    <Nav.Link className='ms-auto'>Register</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='login'>
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                  </>
                  ) : (
                    <>
                      <Button className='ms-auto' variant='light' onClick={logout}>Logout</Button>
                    </>
                )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='h-100'>
        <Outlet />
      </div>
    </>
  )
}

export default MyNavbar