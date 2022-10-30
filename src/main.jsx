import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Routes/Register';
import Chat from './Routes/Chat';
import Conversations from './Routes/Conversations';
import Login from './Routes/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthContextProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './Components/Navbar';
import ActiveConversations from './Routes/ActiveConversations';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='' element={
          <AuthContextProvider>
            <MyNavbar />
          </AuthContextProvider>
        }
        >
          <Route path='register' element={<Register />}/>
          <Route path='login' element={<Login />}/>
          <Route
            path='conversations/'
            element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            }
          />
          <Route path='active_chats/' element={
            <ProtectedRoute>
              <ActiveConversations />
            </ProtectedRoute>
          }/>
          <Route path='chat/:conversationName' element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }/>
        </Route>
      </Route>
    </Routes>
  </Router>
)
