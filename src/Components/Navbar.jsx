import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContext";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const MyNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { unreadMessageCount } = useContext(NotificationContext);

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center h-100">
        <div className="col-12">
          <Navbar
            collapseOnSelect
            className="mb-md-3 py-0 mynavbar"
            expand="md"
          >
            <Container>
              <Navbar.Brand href="/">
                <FontAwesomeIcon icon={faComments} size="2x" inverse />
                <span>
                  {unreadMessageCount > 0 && (
                    <span className="nav-text">({unreadMessageCount})</span>
                  )}
                </span>{" "}
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="chat-navbar" />
              <Navbar.Collapse id="chat-navbar">
                <Nav className="flex-grow-1">
                  {user && (
                    <Navbar.Text>
                      <span className="nav-text px-3">Logged in as {user}</span>
                    </Navbar.Text>
                  )}
                  {!user ? (
                    <>
                      <LinkContainer to="register">
                        <Nav.Link className="ms-md-auto">
                          <span className="nav-text px-3">Register</span>
                        </Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="login">
                        <Nav.Link>
                          <span className="nav-text px-3">Login</span>
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  ) : (
                    <Button
                      className="ms-md-auto"
                      variant="outline"
                      onClick={logout}
                    >
                      <span className="nav-text">Logout</span>
                    </Button>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNavbar;
