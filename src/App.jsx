// import { Outlet } from 'react-router-dom'
// import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ActiveConversations from './Routes/ActiveConversations';
import Chat from './Components/Chat';
import Conversations from './Routes/Conversations';
import Register from './Routes/Register'
import Login from './Routes/Login';
import Navbar from './Components/Navbar';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthContextProvider } from './contexts/AuthContext';


const App = () => {

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <AuthContextProvider>
              <Navbar />
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

//   return (
//     <Container fluid>
//          <Outlet />
//     </Container>
//   )
// }

export default App
