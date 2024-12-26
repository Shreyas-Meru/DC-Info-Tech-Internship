const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the cors package
const connectDB = require("./db");
const User = require("./models/User");
const Todo = require("./models/Todo");

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Enable CORS for the specified origin

// Connect to MongoDB
connectDB();

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};

// Register user
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("Invalid username or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid username or password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.send({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get all todos for a user
app.get("/todos", authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a new todo
app.post("/todos", authenticate, async (req, res) => {
  if (!req.body.text) {
    return res.status(400).send("Text field is required.");
  }

  try {
    const todo = new Todo({
      text: req.body.text,
      userId: req.user.id,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// Delete a todo
app.delete("/todos/:id", authenticate, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!todo) return res.status(404).send("Todo not found");
    res.send("Todo deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
