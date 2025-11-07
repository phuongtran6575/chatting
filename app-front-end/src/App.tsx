import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ChatRoomPage from './Pages/ChatRoomPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';

function App() {

  return (
    <>
      <BrowserRouter>
        <Box>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/chatroom' element={<ChatRoomPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </>
  )
}

export default App
