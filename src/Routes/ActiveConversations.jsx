import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContext";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { InputGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const ActiveConversations = () => {
  const { unreadMessageCount, currentMessage } =
    useContext(NotificationContext);
  const { user, tokens, refreshTokens } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const handleCloseOffcanvas = () => setShow(false);
  const handleShowOffcanvas = () => setShow(true);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("http://localhost:8000/api/conversations/", {
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });
      // If unauthorized by the server - refresh tokens
      if (res.status === 401) {
        var refreshedTokens = await refreshTokens();
        // If it does not return a pair of tokens, set Error message and return
        if (!refreshedTokens.access) {
          setErr("Something whet wrong. Try to login again");
          return;
        }
        // Once new pair is obtained retry to fetch all users with new access token
        const freshRes = await fetch(
          "http://localhost:8000/api/conversations/",
          {
            headers: {
              Authorization: `Bearer ${refreshedTokens.access}`,
            },
          }
        );
        // On succes, set React state variable with an array of users
        const freshData = await freshRes.json();

        setConversations(freshData);
        return;
      }
      const data = await res.json();
      setConversations(data);
    }
    fetchUsers();
  }, [unreadMessageCount, currentMessage]);

  function createConversationName(username) {
    const namesAlph = [user, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  function formatMessageTimestamp(timestamp) {
    if (!timestamp) return;
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 4);
  }

  return (
    <>
      <Row className="justify-content-start gx-3">
        <Col md={4} xl={3} className="d-none d-md-flex flex-column chat">
          <Card className="contacts_card">
            <Card.Header>
              <InputGroup>
                <Form.Control
                  placeholder="Search (in development)"
                  className="search"
                />
                <Button
                  style={{
                    backgroundColor: "rgba(0,0,0,0.3",
                    border: "0",
                    borderRadius: "0 15px 15px 0",
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
            </Card.Header>
            <Card.Body className="contacts_body">
              <ul className="contacts">
                {conversations.map((c) => (
                  <LinkContainer
                    to={`./${createConversationName(c.other_user.username)}`}
                    key={c.other_user.username}
                  >
                    <li key={c.other_user.username}>
                      <div className="d-flex bd-highlight">
                        <div
                          style={{ minWidth: "70px" }}
                          className="d-flex border rounded-circle justify-content-center align-items-center bg-light img_cont"
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            color="grey"
                            size="2x"
                          />
                        </div>
                        {c.last_message ? (
                          <div className="user_info flex-grow-1">
                            <div className="d-flex justify-content-between me-3">
                              <span>{c.other_user.username}</span>
                              {c.unread_count > 0 && (
                                <p className="mb-0 py-2 fw-bold nav-text">
                                  ({c.unread_count})
                                </p>
                              )}
                            </div>
                            <div className="d-flex justify-content-between me-3">
                              <p>{c.last_message.content.slice(0, 30)}</p>{" "}
                              <p>
                                {formatMessageTimestamp(
                                  c.last_message.timestamp
                                )}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="user_info">
                            <div className="d-flex justify-content-between me-3">
                              <span>{c.other_user.username}</span>
                            </div>
                            <p>Start talking!</p>
                          </div>
                        )}
                      </div>
                    </li>
                  </LinkContainer>
                ))}
              </ul>
            </Card.Body>
            <Card.Footer></Card.Footer>
          </Card>
        </Col>
        <Col md={8} xl={6} className="chat flex-grow-1">
          <div className="d-grid g-2 offcanvas-trigger">
            <Button
              variant="outline"
              className="text-start d-flex d-md-none mb-1 py-3 px-4 rounded-4"
              onClick={handleShowOffcanvas}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="2x" />
            </Button>
          </div>
          <Outlet />
        </Col>
      </Row>
      <Offcanvas show={show} onHide={handleCloseOffcanvas} responsive="md">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Active Conversations</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="contacts d-md-none">
            {conversations.map((c) => (
              <LinkContainer
                to={`./${createConversationName(c.other_user.username)}`}
                key={c.other_user.username}
              >
                <li key={c.other_user.username}>
                  <div className="d-flex bd-highlight offcanvas-card">
                    <div
                      style={{ minWidth: "70px" }}
                      className="d-flex border rounded-circle justify-content-center align-items-center bg-light img_cont"
                    >
                      <FontAwesomeIcon icon={faUser} color="grey" size="2x" />
                    </div>
                    {c.last_message ? (
                      <div className="user_info flex-grow-1">
                        <div className="d-flex justify-content-between me-3">
                          <span>{c.other_user.username}</span>{" "}
                          {c.unread_count > 0 && (
                            <p className="mb-0 py-2 fw-bold nav-text">
                              ({c.unread_count})
                            </p>
                          )}
                        </div>
                        <div className="d-flex justify-content-between me-3">
                          <p>{c.last_message.content}</p>{" "}
                          <p>
                            {formatMessageTimestamp(c.last_message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="user_info">
                        <div className="d-flex justify-content-between me-3">
                          <span>{c.other_user.username}</span>
                        </div>
                        <p>Start talking!</p>
                      </div>
                    )}
                  </div>
                </li>
              </LinkContainer>
            ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ActiveConversations;
