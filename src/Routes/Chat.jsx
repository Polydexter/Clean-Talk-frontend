import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import Message from '../Components/Message';
import Button from 'react-bootstrap/Button'

const Chat = () => {

  const { conversationName } = useParams();
  const { user, refreshTokens } = useContext(AuthContext);

  // Set a URL for websocket connection
  const backendURL = `ws://localhost:8000/${conversationName}/`;
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');

  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);

  // Ensure that websocket is instantiated only once per visit
  async function establishConnection() {
    const tokens = await refreshTokens();
    const socketURL = backendURL + '?token=' + tokens.access;
    setSocket(new WebSocket(socketURL));
  }

  useEffect( () => {
    if (user) {
      establishConnection();
    }
  }, [])
  

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        setConnectionStatus('Connected');
      };
      socket.onclose = () => {
        setConnectionStatus('Disconnected');
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
    <Row className='justify-content-center'>
      <Col lg={6} md={8} sm={10} xs={12}>
        <div className='text-center mb-3'>
          <h3>Chat</h3>
        </div>
        <ul className='list-unstyled'>
        {messageHistory.map((message) => (
          <Message key={message.id} message={message}/>
        ))}
        </ul>
        <Stack direction='horizontal' gap={3}>
        <Form.Control className='me-auto text-wrap'
          type="text"
          name='message'
          placeholder='Type your message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant='outline-secondary' type='submit' onClick={handleSubmitMessage}>Send</Button>
        </Stack>
      </Col>
    </Row>
  )
}

export default Chat