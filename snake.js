document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    var modal = document.getElementById("modal");

    // Get the button that opens the modal
    var btn = document.getElementById("playButton");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
        loadGame();
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Function to load the game (you can replace this with your game logic)
    function loadGame() {
        var gameContainer = document.getElementById("gameContainer");
        gameContainer.innerHTML = '<iframe src="path/to/your/game.html" width="100%" height="100%" frameborder="0"></iframe>';
    }
});