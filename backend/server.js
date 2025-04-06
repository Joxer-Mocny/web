// Import necessary packages 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { posliHighscoreEmail } = require('./mailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json()); 
app.use(cors()); 

// Get values from Heroku Config Vars
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;


// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/highscore', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define schema for high scores
const highScoreSchema = new mongoose.Schema({
   game: String,
   name: String,
   score: Number,
   date: { type: Date, default: Date.now }
});

// Create model from schema
const HighScore = mongoose.model('HighScore', highScoreSchema);

function verifyToken(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];  // Get the token from Authorization header (Bearer token)

  if (!token) {
      return res.status(401).send('Unauthorized');  // If no token is provided
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(403).send('Forbidden');  // If token is invalid
      }
      req.user = decoded;  // Store the decoded token information into the request
      console.log("Decoded user data:", req.user);  // Debug log for decoded user
      next();  // Proceed to the next middleware (or route)
  });
}



// Endpoint pre login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check the username and password against Config Vars
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.session.user = { username };  // Store user info in session
      return res.json({ message: 'Login successful' });
  } else {
      return res.status(401).send('Invalid credentials');
  }
});

// Protected route for admin panel (requires a valid token)
app.get('/admin', (req, res) => {
  if (!req.session.user) {
      return res.status(401).send('Unauthorized');
  }
  res.sendFile(path.join(__dirname, '..', 'admin.html'));
});

// Endpoint for logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send('Error logging out');
      }
      res.clearCookie('connect.sid');  // Clear session cookie
      res.send('Logged out');
  });
});


// GET endpoint to fetch top 10 highscores for a game
app.get('/highscores/:game', async (req, res) => {
  const game = req.params.game;
  try {
    // Snake scores are sorted ascending (lower = better), others descending
    const sortOrder = game === 'snake' ? 1 : -1;

    const scores = await HighScore.find({ game })
      .sort({ score: sortOrder })
      .limit(10);

    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching high scores' });
  }
});

// POST endpoint to submit a new highscore
app.post('/submit-highscore', async (req, res) => {
  const { game, name, score } = req.body;
  try {
    // Save new score to database
    const newScore = new HighScore({ game, name, score });
    await newScore.save();

    // Check if total scores exceed 100 for this game
    const count = await HighScore.countDocuments({ game });

    if (count > 100) {
      const sortOrder = game === 'snake' ? 1 : -1;

      // Delete lowest-ranked scores beyond top 100
      const scoresToDelete = await HighScore.find({ game })
        .sort({ score: sortOrder })
        .skip(100);

      const idsToDelete = scoresToDelete.map(doc => doc._id);
      await HighScore.deleteMany({ _id: { $in: idsToDelete } });
    }

    // Send email notification
    posliHighscoreEmail(name, score);
    res.status(201).send('High score submitted');
  } catch (error) {
    res.status(500).json({ error: 'Error saving high score' });
  }
});

// DELETE endpoint to delete a highscore
app.delete('/highscore/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await HighScore.findByIdAndDelete(id);
    if (result) {
      res.status(200).send('Highscore deleted');
    } else {
      res.status(404).send('Highscore not found');
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting highscore' });
  }
});

const path = require('path');

// Serve static files (like HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..')));

// Get endpoint to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve  login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'login', 'login.html'));  
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
