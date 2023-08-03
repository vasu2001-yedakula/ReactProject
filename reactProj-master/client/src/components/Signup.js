import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    if (!firstName || !lastName || !email || !role || !password) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        firstName: firstName,
        lastName: lastName,
        email,
        role,
        password,
      });

      // Assuming the server responds with a success status
      if (response.status === 201) {
        alert('Signup successful! You can now log in.');
        navigate('/login'); // Redirect to the login page upon successful signup
      } else {
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <div className="signup-input">
        <label>First Name</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="signup-input">
        <label>Last Name</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div className="signup-input">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="signup-input">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option> {/* Add an empty option for validation */}
          <option value="recruiter">Recruiter</option>
          <option value="aspirant">Aspirant</option>
        </select>
      </div>
      <div className="signup-input">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="signup-input">
        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      <button className="signup-button" onClick={handleSignup}>Signup</button>
      <Link to="/login" className="login-link">Already have an account? Login</Link>
    </div>
  );
};

export default Signup;