import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'
import Button from 'react-bootstrap/Button';
import { LinkContainer } from "react-router-bootstrap";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const ActiveConversations = () => {
    const { user, tokens } = useContext(AuthContext);
    const [conversations, setConversations ] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch('http://localhost:8000/api/conversations/', {
                headers: {
                    Authorization: `Bearer ${tokens.access}`
                }
            });
            const data = await res.json();
            setConversations(data)
        }
        fetchUsers();
    }, [tokens])

    function createConversationName(username) {
        console.log(username)
        console.log(user.username)
        const namesAlph = [user, username].sort();
        return `${namesAlph[0]}__${namesAlph[1]}`;
    }

    function formatMessageTimestamp(timestamp) {
        if (!timestamp) return;
        const date = new Date(timestamp);
        return date.toLocaleTimeString().slice(0, 4);
    }

    return (
        <Row className='justify-content-center'>
            <Col lg={6} md={8} sm={10} xs={12}>
                <h3 className="text-center mb-3">Active Conversations</h3>
                <div className='d-grid gap-2 text-center'>
                    {conversations.map((c) => (
                            <LinkContainer
                                to={`../chat/${createConversationName(c.other_user.username)}`}
                                key={c.other_user.username}
                            >
                                <Button key={c.other_user.username} className="d-flex justify-between bg-light text-dark rounded-3 shadow-sm border-0">
                                    <h5 className="d-inline-block">{c.other_user.username}</h5>{" "}<span className="flex-grow-1 text-end"><small>{c.last_message.content} {formatMessageTimestamp(c.last_message.timestamp)}</small></span>
                                </Button>
                            </LinkContainer>
                    ))}
                </div>
            </Col>
        </Row>
    );
}

export default ActiveConversations