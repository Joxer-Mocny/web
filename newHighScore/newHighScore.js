// Checks if current score is a new high score (lower is better)
function checkHighScore(currentScore, game, callback) {
    fetch(`http://localhost:3000/highscores/${game}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(scores => {
            const highestScore = scores.length ? scores[0].score : Infinity;
            if (currentScore < highestScore) {
                callback(currentScore);
            }
        })
        .catch(error => console.error('Error fetching high scores:', error));
 }
 
 // Submits new high score to the backend
 function submitHighScore(game, playerName, score) {
    const newHighScore = { game, name: playerName, score };
    fetch('http://localhost:3000/highscores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHighScore)
    })
    .then(response => {
        if (response.ok) {
            alert('High score submitted!');
            document.getElementById("highScorePopup").style.display = "none";
            document.getElementById("playerName").value = '';
        } else {
            alert('Error submitting high score');
        }
    })
    .catch(error => console.error('Error submitting high score:', error));
 }
 