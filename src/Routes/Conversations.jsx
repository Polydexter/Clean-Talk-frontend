import React from 'react'
import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";

const Conversations = () => {
  const { user, tokens, refreshTokens } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    // This function should get all available users with current access token or try to refresh tokens and use a new one 
    async function fetchUsers() {
        // Request with current access token
        const res = await fetch('http://localhost:8000/users', {
            headers: {
                Authorization: `Bearer ${tokens.access}`
            }
        });
        console.log("Response to original request(with not refreshed tokens): ", res)
        // If unauthorized by the server
        if (res.status === 401) {
          // Function from AuthService. It gets new pair of tokens, sets it in storage as a current pair and returns the pair to caller
          var refreshedTokens = await refreshTokens();
          console.log("Response to the request for refreshed tokens: ", refreshedTokens)
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
    <div>
        { err && <div>{err}</div>}
        { users
            .filter((u) => u.username !== user)
            .map((u, idx) => (
                <Link key={idx} to={`../chat/${createConversationName(u.username)}`}>
                    <div key={u.username}>{u.username}</div>
                </Link>
            ))}
    </div>
  );
}

export default Conversations