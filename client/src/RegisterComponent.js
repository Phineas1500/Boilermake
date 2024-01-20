// RegisterComponent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { registerUser } from './authService'; // Import the registerUser function
import { saveUserProfile } from './userService'; // Import the createUserProfile function

const RegisterComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for storing error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Register user with Firebase Auth
      const userCredential = await registerUser(email, password);
      console.log('UserCredential:', userCredential);
      const user = userCredential.user;
      console.log(user);

      // Create a new profile in Firestore for the registered user
      await saveUserProfile(user.uid, {
        balance: 100000, // Initial balance
        portfolio: {} // Initial empty portfolio
      });

      // Redirect to login page after successful registration
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
