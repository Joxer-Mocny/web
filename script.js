document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

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
        disableArrowScroll();
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        unloadGame();
        enableArrowScroll();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            unloadGame();
            enableArrowScroll();
        }
    }

    // Function to load the game
    function loadGame() {
        var gameContainer = document.getElementById("gameContainer");
        gameContainer.innerHTML = '<iframe src="snake.html" width="100%" height="100%" frameborder="0"></iframe>';
    }

    // Function to unload the game
    function unloadGame() {
        var gameContainer = document.getElementById("gameContainer");
        gameContainer.innerHTML = ''; // Clear the game container to stop the game
    }

    // Function to disable arrow key scrolling
    function disableArrowScroll() {
        window.addEventListener("keydown", preventArrowScroll);
    }

    // Function to enable arrow key scrolling
    function enableArrowScroll() {
        window.removeEventListener("keydown", preventArrowScroll);
    }

    // Function to prevent arrow key scrolling
    function preventArrowScroll(e) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
        }
    }
});
