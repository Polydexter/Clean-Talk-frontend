import React from 'react'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const Conversations = () => {
  const { user, tokens, refreshTokens } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    // Get all available users with current access token or try to refresh tokens and use a new one 
    async function fetchUsers() {
        // Request with current access token
        const res = await fetch('http://localhost:8000/users', {
            headers: {
                Authorization: `Bearer ${tokens.access}`
            }
        });
        // If unauthorized by the server - refresh tokens
        if (res.status === 401) {
          var refreshedTokens = await refreshTokens();
          // If it does not return a pair of tokens, set Error message and return
          if (!refreshedTokens.access) {
            setErr('Something whet wrong. Try to login again');
            return;
          }
          // Once new pair is obtained retry to fetch all users with new access token
          const freshRes = await fetch('http://localhost:8000/users', {
            headers: {
                Authorization: `Bearer ${refreshedTokens.access}`
            }
          });
          // On succes, set React state variable with an array of users
          const freshData = await freshRes.json();
          setUsers(freshData);
          return;
        }
        // On succes, set React state variable with an array of users
        const data = await res.json();
        setUsers(data);
    }
    fetchUsers();
  }, [user]);

  function createConversationName(username) {
    const namesAlph = [user, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  return (
    <Row className='justify-content-center'>
      <Col lg={6} md={8} sm={10} xs={12}>
        { err && <div>{err}</div>}
        <div className='d-grid gap-2 text-center'>
          <h3>Active users</h3>
          { users
              .filter((u) => u.username !== user)
              .map((u, idx) => (
                  <LinkContainer key={idx} to={`../chat/${createConversationName(u.username)}`}>
                      <Button className='bg-light text-dark rounded-3 shadow-sm border-0' key={u.username}><h5>{u.username}</h5></Button>
                  </LinkContainer>
                  ))
          }
        </div>
      </Col>
    </Row>
  );
}

export default Conversations