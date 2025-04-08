document.addEventListener("DOMContentLoaded", () => {
    // Set the default game variable
    let game = 'snake';

    // Get the game selection dropdown element
    const gameSelect = document.getElementById("gameSelect");

    // Set the initial value of the game selection dropdown
    if (gameSelect) {
        gameSelect.value = game;
    }

    // Add an event listener to detect changes in game selection
    if (gameSelect) {
        gameSelect.addEventListener("change", (event) => {
            game = event.target.value;
            console.log("Selected game:", game);
            loadHighscores(); // Reload highscores for the selected game
        });
    }

    // Function to load high scores for the selected game
    async function loadHighscores() {
        const response = await fetch(`/highscore/${game}`);
        const highscores = await response.json();
        const highscoreList = document.getElementById("highscoreItems");

        if (highscoreList) {
            highscoreList.innerHTML = ''; // Clear existing high scores
            highscores.forEach(score => {
                const li = document.createElement("li");
                li.textContent = `${score.name}: ${score.score}`;
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => deleteHighscore(score._id));
                li.appendChild(deleteButton);
                highscoreList.appendChild(li);
            });
        }
    }

    // Function to delete a high score
    async function deleteHighscore(id) {
        const response = await fetch(`/highscore/${id}`, {
            method: 'DELETE',
        });
    
        if (response.ok) {
            alert("Item was deleted.");
            loadHighscores();  // Reload highscores after deletion
        } else {
            alert("Failed to delete item.");
        }
    }

     // Logout button functionality
     const logoutBtn = document.getElementById("logoutBtn");
     if (logoutBtn) {
         logoutBtn.addEventListener("click", () => {
             fetch('/logout', { method: 'POST' }) // Send POST request to the logout endpoint
                 .then(() => {
                     window.location.href = '/login';  // Redirect to login page after logging out
                 })
                 .catch(error => {
                     console.error('Logout error:', error);
                     alert('Logout failed!');
                 });
         });
     }
    
    // Call the loadHighscores function when the page loads
    loadHighscores();
});
