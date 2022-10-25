import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Message from '../Components/Message';

const Chat = () => {

  const { conversationName } = useParams();
  const { user, refreshTokens } = useContext(AuthContext);

  // Set a URL for websocket connection with backend domain (hardcoded for now)
  const backendURL = `ws://localhost:8000/${conversationName}/`;
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);

  // Ensure that websocket is instantiated only once

  async function establishConnection() {
    const tokens = await refreshTokens();
    console.log("Establish connection tokens: ", tokens)
    const socketURL = backendURL + '?token=' + tokens.access;
    console.log("Establish connection URL: ", socketURL)
    setSocket(new WebSocket(socketURL));
  }

  useEffect( () => {
    if ((socket === null) && (user)) {
      establishConnection();
    }
  }, [])
  

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        setConnectionStatus('Connected');
        console.log('Hi, server!')
      };
      socket.onclose = () => {
        setConnectionStatus('Disconnected');
        console.log('Bye, server!')
      };
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        switch (data.type) {
          case "chat_message_echo":
            setMessageHistory((prev) => prev.concat(data.message));
            break;
          case "last_20_messages":
            setMessageHistory(data.messages);
            break;
        }
        
      }
    }
  })

  const handleSubmitMessage = () => {
    socket.send(JSON.stringify({
      'type': 'chat_message',
      'message': message
    }));
    setMessage('');
  }

  return (
    <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}}>
        <h1>Chat</h1>
        <p>Websocket is {connectionStatus}</p>
        <br />
        <ul>
        {messageHistory.map((message) => (
          <div>
            <Message key={message.id} message={message}/>
          </div>
        ))}
        </ul>
        <input
          type="text"
          name='message'
          placeholder='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type='submit' onClick={handleSubmitMessage}>Send</button>
    </div>
  )
}

export default Chat