// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { posliHighscoreEmail } = require('./mailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

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

// Middleware for verifying JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from header

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  // Verify token and attach user to request
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if invalid
    req.user = user;
    next();
  });
}

// Login endpoint for admin
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check credentials against environment variables
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Generate JWT token (valid for 2 hours)
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
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

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin/adminPanel.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
