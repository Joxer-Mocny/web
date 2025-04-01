// Load high scores for selected game
async function loadScores() {
  const game = document.getElementById('gameSelect').value;
  const token = localStorage.getItem('adminToken');

  const res = await fetch(`http://localhost:3000/highscores/${game}`);
  const data = await res.json();

  const scoresDiv = document.getElementById('scores');
  scoresDiv.innerHTML = ''; // Clear previous entries

  // Create score entries in the DOM
  data.forEach(score => {
    const entry = document.createElement('div');
    entry.className = 'score-entry';
    entry.innerHTML = `${score.name}: ${score.score} <button onclick="deleteScore('${game}', '${score.name}')">Delete</button>`;
    scoresDiv.appendChild(entry);
  });
}

// Delete high scores by player name
async function deleteScore(game, name) {
  const token = localStorage.getItem('adminToken');
  const confirmDelete = confirm(`Are you sure you want to delete all scores for '${name}'?`);
  if (!confirmDelete) return;

  const res = await fetch(`http://localhost:3000/highscores/${game}/${name}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (res.ok) {
    alert('Score(s) deleted');
    loadScores(); // Reload scores
  } else {
    alert('Failed to delete score(s)');
  }
}
