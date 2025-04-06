document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is logged in
    fetch('/admin', {
        method: 'GET',
        credentials: 'same-origin',
    })
    .then(response => {
        if (response.status !== 200) {
            window.location.href = '/prihlasenie';  // Redirect to login if the user is not logged in
        } else {
            loadHighscores();  // Load the high scores if the user is logged in
        }
    })
    .catch(error => {
        console.error("Error fetching admin page:", error);
        window.location.href = '/prihlasenie';  // If there's an error, redirect to login
    });

    // Function to load high scores from the database
    async function loadHighscores() {
        const game = 'snake';  // You can change this to dynamically select a game
        const response = await fetch(`/highscores/${game}`);
        const highscores = await response.json();
        const highscoreList = document.getElementById("highscoreItems");

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

    // Function to delete a high score
    async function deleteHighscore(id) {
        const response = await fetch(`/delete/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("The entry has been deleted.");
            loadHighscores();  // Reload the high scores after deletion
        } else {
            alert("Failed to delete the entry.");
        }
    }

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
        fetch('/logout', { method: 'POST' })
            .then(() => {
                window.location.href = '/prihlasenie';  // After logout, redirect to the login page
            });
    });
});
