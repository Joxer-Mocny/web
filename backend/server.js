const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parse');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/highscores', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  const highScoreSchema =new mongoose.Schema({
    game: String,
    name: String,
    score: Number,
    date: { type: Date, default: Date.now }
  });

    const HighScore = mongoose.model('HoghScore', highScoreSchema);

    app.get('/HighScore/:game', async (req, res) =>{
        const game = req.params.game;
        try{
            const scores = await HighScore.find({ game }).sort({date: -1}).limit(10);
            res.json(score);
        }catch (error) {
            res.status(500).json({error: 'Error fetching high scores' })
        }
    });

    app.post('/highscore', async (req, res) =>{
        const {game, name, score} = req.body;
        try{
            const newScore = newHighScore({ game, name, score});
            await newScore.save();
            res.status(201).send('High score submitted');
        }catch(error){
            res.status(500).json({error: 'Error saving high score' });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
