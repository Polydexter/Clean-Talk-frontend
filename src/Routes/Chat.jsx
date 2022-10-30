import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import Message from '../Components/Message';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

const Chat = () => {

  const { conversationName } = useParams();
  const { user, tokens, refreshTokens } = useContext(AuthContext);

  // Set a URL for websocket connection
  const backendURL = `ws://localhost:8000/${conversationName}/`;
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');

  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);

  const [page, setPage] = useState(2);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

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
            setMessageHistory((prev) => [data.message, ...prev]);
            break;
          case "last_20_messages":
            setMessageHistory(data.messages);
            setHasMoreMessages(data.has_more);
            break;
        }
        
      }
    }
  })

  async function fetchMessages() {
    console.log("Fetch Messages triggered")
    const apiRes = await fetch(
      `http://localhost:8000/api/messages/?conversation=${conversationName}&page=${page}`,
      {
        method: 'GET',
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokens.access}`
        }
      }
    );
    console.log("Fetch messages response: ", apiRes)
    if (apiRes.status === 200) {
      const data = await apiRes.json();
      setHasMoreMessages(data.next !== null);
      setPage(page + 1);
      setMessageHistory((prev) => prev.concat(data.results));
    }
  }

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
        <div
          id='scrollableDiv'
          className='d-flex overflow-auto flex-column-reverse p-6 mt-3 border-secondary' // Puts scroll at the bottom
          style={{'height': '30rem'}}
        > 
          <div>
            <InfiniteScroll
              dataLength={messageHistory.length}
              next={fetchMessages}
              className="d-flex flex-column-reverse" // Puts loader to the top
              inverse={true}
              hasMore={hasMoreMessages}
              loader={<Spinner role='status' animation='border'/>}
              scrollableTarget='scrollableDiv'
            >
              {messageHistory.map((message) => (
                <Message key={message.id} message={message}/>
              ))}
            </InfiniteScroll>
          </div>
        </div>
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