// frontend/src/App.js 

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatInterface from './components/ChatInterface';
import AdminPanel from './components/AdminPanel';
import { ToastContainer } from 'react-toastify';
import './styles/App.css';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/chat" 
            element={
              <PrivateRoute>
                <ChatInterface />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            } 
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;