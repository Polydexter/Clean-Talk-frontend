import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import Navbar from './Components/Navbar'
import Chat from './Routes/Chat'
import Login from './Routes/Login'
import Register from './Routes/Register'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='' element={<Navbar />}>
          <Route path='register' element={<Register />}/>
          <Route path='login' element={<Login />}/>
          <Route path='chat' element={<Chat />}/>
        </Route>
      </Route>
    </Routes>
  </Router>
)
