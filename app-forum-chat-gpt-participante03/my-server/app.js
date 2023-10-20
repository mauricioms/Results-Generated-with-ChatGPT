const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory array to store registered users
const users = [];

// Route to register a user
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
});

// Route to get the list of registered users
app.get('/users', (req, res) => {
  res.status(200).json({ users });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
