function checkHighScore(currentScore, game, callback) {
    fetch('http://localhost:3000/highscores/' + game) // Ensure the correct server URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(scores => {
            console.log('Scores fetched:', scores); // Log scores for debugging
            const highestScore = scores.length ? scores[0].score : 0;
            if (currentScore > highestScore) {
                callback(currentScore);
            }
        })
        .catch(error => console.error('Error fetching high scores:', error));
 }
 

 function submitHighScore(game, playerName, score) {
    const newHighScore = {
        game: game,
        name: playerName,
        score: score 
    };
    console.log('Submitting high score:', newHighScore); // Log high score for debugging
    fetch('http://localhost:3000/highscores', { // Ensure the correct server URL
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
            document.getElementById("playerName").value = ''; // Clear input
        } else {
            alert('Error submitting high score');
        }
    })
    .catch(error => console.error('Error submitting high score:', error));
}
