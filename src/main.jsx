import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './Routes/Register';
import Chat from './Routes/Chat';
import Login from './Routes/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthContextProvider } from './contexts/AuthContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='' element={
          <AuthContextProvider>
            <Navbar />
          </AuthContextProvider>
        }
        >
          <Route path='register' element={<Register />}/>
          <Route path='login' element={<Login />}/>
          <Route path='chat' element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }/>
        </Route>
      </Route>
    </Routes>
  </Router>
)
