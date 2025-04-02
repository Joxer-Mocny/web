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
    entry.innerHTML = `${score.name}: ${score.score} <button onclick="deleteScore('${score._id}')">Delete</button>`;
    scoresDiv.appendChild(entry);
  });
}

// Delete high scores by player name
async function deleteScore(id) {
  const token = localStorage.getItem('adminToken');
  const confirmDelete = confirm('Are you sure you want to delete this score?');
  if (!confirmDelete) return;

  const res = await fetch(`http://localhost:3000/highscore/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (res.ok) {
    alert('Score deleted');
    loadScores(); // Refresh list
  } else {
    alert('Failed to delete score');
  }
}

