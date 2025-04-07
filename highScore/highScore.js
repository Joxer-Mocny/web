document.getElementById('showHighScoresButton').addEventListener('click', async () => {
    const game = document.getElementById('gameSelect').value;
    try {
        const response = await fetch(`https://filiptrcka-6f2669a91720.herokuapp.com//highscores/${game}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const scores = await response.json();
        const highScoresDiv = document.getElementById('highScores');
        highScoresDiv.innerHTML = `<h3>${game.charAt(0).toUpperCase() + game.slice(1)} High Scores</h3>`;
        scores.forEach(score => {
            highScoresDiv.innerHTML += `<p>${score.name}: ${score.score}</p>`;
        });
    } catch (error) {
        console.error('Error fetching high scores:', error);
    }
 });