// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/highscore')
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err));

const highScoreSchema = new mongoose.Schema({
   game: String,
   name: String,
   score: Number,
   date: { type: Date, default: Date.now }
});
const HighScore = mongoose.model('HighScore', highScoreSchema);

// JWT middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Admin login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Public: Get highscores for a game
app.get('/highscores/:game', async (req, res) => {
  const game = req.params.game;
  try {
    const sortOrder = game === 'snake' ? 1 : -1;
    const scores = await HighScore.find({ game }).sort({ score: sortOrder }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching high scores' });
  }
});

// Public: Submit new high score
app.post('/highscores', async (req, res) => {
  const { game, name, score } = req.body;
  try {
    const newScore = new HighScore({ game, name, score });
    await newScore.save();
    res.status(201).send('High score submitted');
  } catch (error) {
    res.status(500).json({ error: 'Error saving high score' });
  }
});

// Admin only: Delete high score(s) by name
app.delete('/highscores/:game/:name', verifyToken, async (req, res) => {
  const { game, name } = req.params;
  try {
    const result = await HighScore.deleteMany({ game, name });
    if (result.deletedCount > 0) {
      res.status(200).send(`High scores for ${name} deleted`);
    } else {
      res.status(404).send('No high scores found for the specified name');
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting high scores' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
