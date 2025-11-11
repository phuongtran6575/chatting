import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ChatRoomPage from './Pages/ChatRoomPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuthStore } from './core/Stores/authStore';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {

  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Box>
        <Routes>
          {/* Nếu có token mà vẫn vào /login hoặc /, thì chuyển qua /chatroom */}
          <Route path="/" element={token ? <Navigate to="/chatroom" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={token ? <Navigate to="/chatroom" replace /> : <LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Route cần đăng nhập */}
          <Route path="/chatroom" element={
            <ProtectedRoute>
              <ChatRoomPage />
            </ProtectedRoute>} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App
