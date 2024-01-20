// LoginComponent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './authService'; // Import the loginUser function

const LoginComponent = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await loginUser(email, password);
      console.log("Login successful:", userCredential.email); // Log the user object
      setUser(userCredential.email); // Update the user state at the App.js level
      navigate('/stocks');
    } catch (error) {
      // Handle login errors (e.g., display an error message)
      console.error("Login error:", error); // Log any login errors
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
      <button type="button" onClick={() => navigate('/')}>Back</button>
    </form>
  );
};

export default LoginComponent;