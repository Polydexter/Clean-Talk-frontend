import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext'
import { NotificationContext } from "../contexts/NotificationContext";
import Button from 'react-bootstrap/Button';
import { LinkContainer } from "react-router-bootstrap";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Offcanvas } from "react-bootstrap";


const ActiveConversations = () => {
    const { unreadMessageCount } = useContext(NotificationContext)
    const { user, tokens, refreshTokens } = useContext(AuthContext);
    const [conversations, setConversations ] = useState([]);
    const [show, setShow] = useState(false);
    const [err, setErr] = useState('');

    const handleCloseOffcanvas = () => setShow(false)
    const handleShowOffcanvas = () => setShow(true)

    useEffect(() => {
        console.log("Active conversations rerendered")
    })

    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch('http://localhost:8000/api/conversations/', {
                headers: {
                    Authorization: `Bearer ${tokens.access}`
                }
            });
            // If unauthorized by the server - refresh tokens
            console.log(res.status)
            if (res.status === 401) {
                var refreshedTokens = await refreshTokens();
                // If it does not return a pair of tokens, set Error message and return
                if (!refreshedTokens.access) {
                  setErr('Something whet wrong. Try to login again');
                  return;
                }
                // Once new pair is obtained retry to fetch all users with new access token
                const freshRes = await fetch('http://localhost:8000/api/conversations/', {
                  headers: {
                      Authorization: `Bearer ${refreshedTokens.access}`
                  }
                });
                // On succes, set React state variable with an array of users
                const freshData = await freshRes.json();

                setConversations(freshData);
                return;
            }
            const data = await res.json();
            console.log("Fetch conversations data: ", data)
            setConversations(data)
        }
        fetchUsers();
    }, [unreadMessageCount])

    function createConversationName(username) {
        const namesAlph = [user, username].sort();
        return `${namesAlph[0]}__${namesAlph[1]}`;
    }

    function formatMessageTimestamp(timestamp) {
        if (!timestamp) return;
        const date = new Date(timestamp);
        return date.toLocaleTimeString().slice(0, 5);
    }

    return (
        <>
        <Row className='h-90 justify-content-start p-3'>
            <Col xs={4} style={{'border-right': '1px solid black'}} className="d-none d-md-flex flex-column">
                    <h3 className="text-center mb-3">Active Conversations</h3>
                    <div className='d-grid gap-2 text-center'>    
                        {conversations.map((c) => (
                                <LinkContainer
                                    to={`./${createConversationName(c.other_user.username)}`}
                                    key={c.other_user.username}
                                >
                                    <Button key={c.other_user.username} className="d-flex justify-between ml-3 bg-light text-dark rounded-3 shadow-sm border-0">
                                        <h5 className="d-inline-block">{c.other_user.username}</h5>{" "}<span className="flex-grow-1 text-end">{ c.last_message ? (
                                        <small>{c.last_message.content} {formatMessageTimestamp(c.last_message.timestamp)} {c.unread_count}</small>
                                        ) : <small>Start talking!</small>}</span>
                                    </Button>
                                </LinkContainer>
                        ))}
                    </div>
            </Col>
            <Col>
                <div className="d-grid g-2">
                    <Button variant="outline-secondary" className="d-md-none m-3" onClick={handleShowOffcanvas}>
                        &#8592; Chats
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
                <div className='d-md-none d-grid gap-2 text-center'>    
                    {conversations.map((c) => (
                            <LinkContainer
                                to={`./${createConversationName(c.other_user.username)}`}
                                key={c.other_user.username}
                            >
                                <Button
                                    key={c.other_user.username}
                                    className="d-flex justify-between ml-3 bg-light text-dark rounded-3 shadow-sm border-0"
                                    >
                                    <h5 className="d-inline-block">{c.other_user.username}</h5>{" "}<span className="flex-grow-1 text-end">{ c.last_message ? (
                                    <small>{c.last_message.content} {formatMessageTimestamp(c.last_message.timestamp)} {c.unread_count}</small>
                                    ) : <small>Start talking!</small>}</span>
                                </Button>
                            </LinkContainer>
                    ))}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
        </>
    );
}

export default ActiveConversations