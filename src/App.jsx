import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ActiveConversations from './Routes/ActiveConversations';
import Chat from './Components/Chat';
import Register from './Routes/Register'
import Login from './Routes/Login';
import Navbar from './Components/Navbar';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthContextProvider } from './contexts/AuthContext';
import { NotificationContextProvider } from "./contexts/NotificationContext";
import './App.css'

const App = () => {

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <AuthContextProvider>
              <NotificationContextProvider>
                <Navbar />
              </NotificationContextProvider>
            </AuthContextProvider>
          }
        >
          <Route
            path=""
            element={
              <ProtectedRoute>
                  <ActiveConversations />
              </ProtectedRoute>
            }>
              <Route index element={<div className="text-center"> Pick a conversation</div>} />
              <Route 
                    path=":conversationName"
                    element={
                      <Chat />
                    }
                  />
            </Route>
          <Route path='register' element={<Register />}/>
        <Route path='login' element={<Login />}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
