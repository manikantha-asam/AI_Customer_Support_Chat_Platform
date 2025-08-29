// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { username, password });
      // Store user data in local storage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('isAdmin', res.data.isAdmin);
      localStorage.setItem('userId', res.data._id);
      
      toast.success('Login successful!');
      navigate('/chat');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg rounded-3" style={{ width: '25rem' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            <FontAwesomeIcon icon={faRobot} className="me-2 text-primary" />
            AI Chat Support
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="usernameInput" className="form-label">Username</label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="usernameInput"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex:user"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">Password</label>
              <input
                type="password"
                className="form-control rounded-pill"
                id="passwordInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ex:1234"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill mt-3">
              Login
            </button>
          </form>
          <div className="text-center mt-3">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;