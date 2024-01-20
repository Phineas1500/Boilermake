// RegisterComponent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { registerUser } from './authService'; // Import the registerUser function

const RegisterComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for storing error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await registerUser(email, password);
      // Handle successful registration (e.g., redirect to login page)
      navigate('/login');
    } catch (error) {
      // Handle registration errors (e.g., display an error message)
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {error && <p>{error}</p>} {/* Display error message */}
      <button type="submit">Register</button>
      <button type="button" onClick={() => navigate('/')}>Back</button>
    </form>
  );
};

export default RegisterComponent;
