import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const DefaultProps = {
    unreadMessageCount: 0,
    connectionStatus: "Uninstantiated"
}

export const NotificationContext = createContext(DefaultProps);

export const NotificationContextProvider = ({children}) => {
    const {tokens} = useContext(AuthContext);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [notificationWs, setNotificationWs] = useState(null)
    const [connectionStatus, setConnectionStatus] = useState('')
    useEffect(() => {
        console.log("Unread count changed: ", unreadMessageCount)
    }, [unreadMessageCount])


    function establishConnection() {
        // if (socket) {
        //   socket.close()
        // }
        // const tokens = await refreshTokens();
        const backendURL = 'ws://localhost:8000/notifications/';
        const socketURL = backendURL + '?token=' + tokens.access
        setNotificationWs(new WebSocket(socketURL));
      }
    
    useEffect(() => {
    if (tokens) {
        establishConnection();
    }
    }, [tokens])

    useEffect(() => {
        console.log("Use effect (ws.methods) triggered")
        if (notificationWs) {
          notificationWs.onopen = () => {
            setConnectionStatus('Connected');
          };
          notificationWs.onclose = () => {
            setConnectionStatus('Disconnected');
          };
          notificationWs.onmessage = (e) => {
            const data = JSON.parse(e.data);
            switch (data.type) {
                case "unread_count":
                    setUnreadMessageCount(data.unread_count);
                    break;
                case "new_message_notification":
                    setUnreadMessageCount((count) => (count += 1));
                    break;
                default:
                    console.error("Unknown message type");
                    break;
            }
          }
        }
      }, [notificationWs])

    
    // ws logic
    console.log("Unread messages befor return (context): ", unreadMessageCount)
    return (
        <NotificationContext.Provider
            value={{ unreadMessageCount, connectionStatus}}
        >
            {children}
        </NotificationContext.Provider>
    )
}