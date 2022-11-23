import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);

  function formatMessageTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 4);
  }

  return (
    <div
      className={`d-flex mb-4 ${
        user === message.from_user.username
          ? "justify-content-end"
          : "justify-content-start"
      }`}
    >
      <div
        className={`${
          user === message.from_user.username
            ? "msg_container_send"
            : "msg_container"
        }`}
      >
        {message.content}
        <span
          className={`${
            user === message.from_user.username ? "msg_time_send" : "msg_time"
          }`}
        >
          {formatMessageTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default Message;
