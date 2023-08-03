import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import the CSS file for the component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      // Assuming the server responds with a success status
      if (response.status === 200) {
        const { userRole } = response.data;
        // Redirect to the dashboard upon successful login
        navigate('/dashboard', { state: { userRole } });
      } else {
        alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-input">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="login-input">
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="login-button" onClick={handleLogin}>Login</button>
      <Link to="/signup" className="signup-link">Sign up</Link>
    </div>
  );
};

export default Login;
