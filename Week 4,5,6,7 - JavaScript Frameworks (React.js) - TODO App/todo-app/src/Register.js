// src/Register.js
import React, { useState, useEffect  } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation

function Register({ onRegisterSuccess, onError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate hook

  // Check if the user is already logged in and redirect to the homepage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // If token exists, redirect to the home page
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      onError("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
        email,
      });
      setLoading(false);
      onRegisterSuccess(response.data.token); // Assuming the server responds with a token
      onError(""); // Clear any errors
    } catch (err) {
      setLoading(false);
      onError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-form">
      <h2 style={{color: '#4A90E2'}}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            style={{marginTop: '10px', width: '15em'}}
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={{marginTop: '10px', width: '15em'}}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            style={{marginTop: '10px', width: '15em'}}
          />
        </div>
        <button style={{marginTop: '10px'}} type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div style={{ marginTop: '15px' }}>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
