import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Chat = () => {

  const { conversationName } = useParams();
  const { user } = useContext(AuthContext);

  // Set a URL for websocket connection with backend domain (hardcoded for now)
  const backendURL = `ws://localhost:8000/${conversationName}/`;
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);

  // Ensure that websocket is instantiated only once
  useEffect(() => {
    if ((socket === null) && (user.access)) {
      const socketURL = backendURL + '?token=' + user.access;
      console.log(socketURL)
      setSocket(new WebSocket(socketURL));
    }
  }, [socket])

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
        setMessageHistory((prev) => prev.concat(data))
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
        <input
          type="text"
          name='message'
          placeholder='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type='submit' onClick={handleSubmitMessage}>Send</button>
        <hr />
        <ul>
        {messageHistory.map((message, idx) => (
          <div key={idx}>
            {message.message}
          </div>
        ))}
        </ul>
    </div>
  )
}

export default Chat