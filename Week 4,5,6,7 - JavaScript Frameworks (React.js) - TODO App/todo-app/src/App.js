import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Import Routes instead of Switch
import "./App.css";
import Login from "./Login"; // Import the Login component
import Register from "./Register"; // Import the Register component

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check for token in localStorage on page load
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      axios
        .get("http://localhost:5000/todos", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setTodos(response.data))
        .catch((err) => setError(""));
    }
  }, [isLoggedIn, token]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("token", newToken); // Store token in localStorage
    setToken(newToken);
    setIsLoggedIn(true);
    setError("");
  };

  const handleRegisterSuccess = (newToken) => {
    localStorage.setItem("token", newToken); // Store token in localStorage
    setToken(newToken);
    setIsLoggedIn(true);
    setError("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setToken("");
  };

  const addTodo = () => {
    if (todo) {
      setTodos(prevTodos => [
        ...prevTodos,
        { text: todo, id: Date.now() } // Add unique id for each to-do
      ]);
      setTodo(""); // Clear input after adding
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const removeTodo = (id) => {
    // Add a temporary class to trigger animation
    const item = document.getElementById(id);
    item.classList.add('celebrate-animation');

    // Remove the item after the animation
    setTimeout(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }, 500); // Match this time with the animation duration
  };

  return (
    <Router>
      <div className="App">
        <h1>To-Do List</h1>
        {error && <p className="error-message">{error}</p>}

        <Routes>
          {/* Routes for login and register */}
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} onError={setError} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} onError={setError} />} />

          {/* Default route when logged in */}
          <Route path="/" element={
            !isLoggedIn ? (
              <div>
                <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link></p>
              </div>
            ) : (
              <div>
                <div className="todo-input">
                  <input
                    type="text"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter a new to-do"
                  />
                  <button onClick={addTodo}>Add</button>
                </div>
                <ul>
                  {todos.map((todo) => (
                    <li
                      id={todo.id} // Adding id to each todo item for targeting animation
                      key={todo.id}
                      className="todo-item" // Trigger the fall down animation
                    >
                      {todo.text}
                      <button onClick={() => removeTodo(todo.id)} className="delete-btn">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <button onClick={logout}>Logout</button>
              </div>
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
