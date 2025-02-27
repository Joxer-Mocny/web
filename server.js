const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Corrected typo
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
 });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/highscore')
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err));


const highScoreSchema = new mongoose.Schema({
   game: String,
   name: String,
   score: Number,
   date: { type: Date, default: Date.now }
});

const HighScore = mongoose.model('HighScore', highScoreSchema); // Corrected model name

app.get('/highscores/:game', async (req, res) => { // Consistent endpoint naming
   const game = req.params.game;
   try {
       const scores = await HighScore.find({ game }).sort({ date: -1 }).limit(10);
       res.json(scores); // Corrected variable name
   } catch (error) {
       res.status(500).json({ error: 'Error fetching high scores' });
   }
});

app.post('/highscores', async (req, res) => { // Consistent endpoint naming
   const { game, name, score } = req.body;
   try {
       const newScore = new HighScore({ game, name, score }); // Corrected instance creation
       await newScore.save();
       res.status(201).send('High score submitted');
   } catch (error) {
       res.status(500).json({ error: 'Error saving high score' });
   }
});
app.delete('/highscores/:game/:name', async (req, res) => {
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
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
