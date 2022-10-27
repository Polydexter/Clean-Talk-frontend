import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


const Message = ({ message }) => {
  const { user } = useContext(AuthContext);

  function formatMessageTimestamp(timestamp) {
    console.log(user)
    console.log(message.from_user.username)
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 4);
  }

  return (
    <li className={`d-flex ${ user === message.from_user.username ? 'justify-content-start' : 'justify-content-end'}`}>
      <div
        className={`rounded-4 mb-2 px-3 pb-1 align-middle ${ user === message.from_user.username ? 'shadow-sm bg-light' : 'shadow bg-secondary text-light'}`}
      >
        <small>{message.content} [{formatMessageTimestamp(message.timestamp)}]</small>
      </div>
    </li>
    
  )
}

export default Message