// src/Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation

function Login({ onLoginSuccess, onError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  // Check if the user is already logged in and redirect to the homepage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // If token exists, redirect to the home page
    }
  }, [navigate]);

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/login", { username, password }, {
        headers: { "Content-Type": "application/json" }, // Ensure Content-Type header is set
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token); // Store token in localStorage
        onLoginSuccess(response.data.token); // Notify parent of successful login
        onError(""); // Clear any previous errors
        
        // After login, navigate to the main app page
        navigate("/"); // This will redirect to the / route (App.js)
      })
      .catch((error) => {
        console.error("Login error:", error.response || error.message);
        onError("Invalid credentials. Please try again.");
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ margin: '10px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: '10px' }}
      />
      <button style={{ marginTop: '10px' }} onClick={handleLogin}>Login</button>
      
      <div style={{ marginTop: '15px' }}>
        <p>Don't have an account? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}

export default Login;
