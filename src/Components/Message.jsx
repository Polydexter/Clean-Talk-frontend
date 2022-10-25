import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


const Message = ({ message }) => {
  const { user } = useContext(AuthContext);

  function formatMessageTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 7);
  }

  return (
    <li
        style={ user.username === message.from_user.username ? (
                {"textAlign": "left"}
            ) : (
                {'textAlign': 'right'}
            )}
    >
        {message.content} [{formatMessageTimestamp(message.timestamp)}]
    </li>
  )
}

export default Message