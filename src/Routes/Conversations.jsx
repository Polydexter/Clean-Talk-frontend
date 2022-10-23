import React from 'react'
import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";

const Conversations = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
        const res = await fetch('http://localhost:8000/users', {
            headers: {
                Authorization: `Bearer ${user.access}`
            }
        });
        console.log(res)
        const data = await res.json();
        setUsers(data);
    }
    fetchUsers();
  }, [user]);

  function createConversationName(username) {
    const namesAlph = [user.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  return (
    <div>
        { users
            .filter((u) => u.username !== user.username)
            .map((u) => (
                <Link to={`../chat/${createConversationName(u.username)}`}>
                    <div key={u.username}>{u.username}</div>
                </Link>
            ))}
    </div>
  );
}

export default Conversations