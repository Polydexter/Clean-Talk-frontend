import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useHotkeys } from 'react-hotkeys-hook';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import Message from '../Components/Message';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

const Chat = () => {

  // Values from outside of the component
  const { conversationName } = useParams();
  const { user, tokens, refreshTokens } = useContext(AuthContext);

  // Values and handlers for ws connection
  const backendURL = `ws://localhost:8000/${conversationName}/`;
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');

  async function establishConnection() {
    const tokens = await refreshTokens();
    const socketURL = backendURL + '?token=' + tokens.access;
    setSocket(new WebSocket(socketURL));
  }

  useEffect(() => {
    if (user) {
      establishConnection();
    }
  }, [tokens])

  // Values and handlers for  new messages
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);

  const handleSubmitMessage = () => {
    if (message.length === 0) return;
    if (message.length > 512) return;
    socket.send(JSON.stringify({
      'type': 'chat_message',
      'message': message
    }));
    setMessage('');
    clearTimeout(timeout.current)
    timoutFunction();
  }

  const inputReference = useHotkeys(
    "enter",
    () => {
      handleSubmitMessage();
    },
    {
      enableOnTags: ["INPUT"]
    }
  );

  // Data and handlers for displaying old messages
  const [page, setPage] = useState(2);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  async function fetchMessages() {
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

  // Handling online status of users
  const [participants, setParticipants] = useState([]);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    async function fetchConversation() {
      const apiRes = await fetch(`http://localhost:8000/api/conversations/${conversationName}/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`
        }
      });
      if (apiRes.status === 200) {
        const data = await apiRes.json();
        setConversation(data);
      }
    }
    fetchConversation();
  }, [conversationName, user]);

  // User is typing feature
  const [meTyping, setMeTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const timeout = useRef();

  function updateTyping(event) {
    if (event.user !== user) {
      setOtherUserTyping(event.typing);
    }
  }

  function timoutFunction() {
    setMeTyping(false);
    socket.send(JSON.stringify({
      'type': 'typing',
      'typing': false,
    }));
  }

  function onType() {
    if (meTyping === false) {
      setMeTyping(true);
      socket.send(JSON.stringify({
        'type': 'typing',
        'typing': true,
      }));
      timeout.current = setTimeout(timoutFunction, 5000);
    } else {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(timoutFunction, 5000);
    }
  }

  useEffect(() => () => clearTimeout(timeout.current), []);
  

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
          case "user_join":
            setParticipants((users) => {
              if (!users.includes(data.user)) {
                return [...users, data.user];
              }
              return users
            });
            break;
          case "user_leave":
            setParticipants((users) => {
              const newUsers = users.filter((u) => u !== data.user);
              return newUsers;
            });
            break;
          case "online_user_list":
            setParticipants(data.users);
            break;
          case"typing":
          updateTyping(data);
          break;
        }
        
      }
    }
  })

  

  useEffect(() => {
    (inputReference.current).focus();
  }, [inputReference])

  return (
    <Row className='justify-content-center'>
      <Col lg={6} md={8} sm={10} xs={12}>
        {
          conversation && (
            <div className='py-6 text-end'>
              <h3 className='font-wight-bold text-secondary'>
                Chat with {conversation.other_user.username}
              </h3>
              <span>
                <small>
                  {conversation.other_user.username} is {' '}
                  {participants.includes(conversation.other_user.username) ? "online" : "offline" }
                </small>
              </span>
            </div>
          )
        }
        <div
          id='scrollableDiv'
          className='d-flex overflow-auto flex-column-reverse px-2 mt-3 border-secondary' // Puts scroll at the bottom
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
        <div className='text-center text-muted' style={{'height':'2rem',}}>
        { otherUserTyping && <p>{conversation.other_user.username} is typing... </p>}
        </div>
        <Stack direction='horizontal' gap={3}>
        <Form.Control className='me-auto text-wrap'
          type="text"
          name='message'
          placeholder='Type your message...'
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            onType();
          }}
          ref={inputReference}
          maxLength={511}
        />
        <Button variant='outline-secondary' type='submit' onClick={handleSubmitMessage}>Send</Button>
        </Stack>
      </Col>
    </Row>
  )
}

export default Chat