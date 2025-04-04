const token = sessionStorage.getItem('token');
if (!token) {
    window.location.href = '/admin';  
}

async function fetchHighScores() {
    const game = document.getElementById('game').value;
    const response = await fetch(`https://nameless-stream-52860-0d2bd30c49a5.herokuapp.com/highscores/${game}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const scores = await response.json();
        displayHighScores(scores);
    } else {
        alert('Failed to fetch high scores');
    }
}

async function deleteHighScore(id) {
    const response = await fetch(`https://nameless-stream-52860-0d2bd30c49a5.herokuapp.com/highscore/${id}`, {  // Update to Heroku URL
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        alert('Score deleted');
        fetchHighScores();  // Refresh the scores
    } else {
        alert('Failed to delete score');
    }
}

function displayHighScores(scores) {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';

    scores.forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = `${score.playerName}: ${score.score}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteHighScore(score._id);
        listItem.appendChild(deleteButton);
        scoreList.appendChild(listItem);
    });
}

document.getElementById('game').addEventListener('change', fetchHighScores);
fetchHighScores();  


