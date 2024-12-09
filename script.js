document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for anchor links and center sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset - (window.innerHeight / 2) + (target.offsetHeight / 2);

            window.scrollTo({
                top: offsetPosition,
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
        if (window.innerWidth >= 769) { // PC screen
            gameContainer.innerHTML = '<iframe src="snake.html" frameborder="0" style="width:100%; height:100%;"></iframe>';
        } else { // Mobile screen
            gameContainer.innerHTML = '<iframe src="snakeMobile.html" frameborder="0" style="width:100%; height:100%;"></iframe>';
        }
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

    // Parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        document.body.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    });

    // Mobile specific code
    if (window.innerWidth <= 768) {
        document.querySelectorAll('section .content').forEach(content => {
            content.style.display = 'none'; // Hide content by default on mobile
        });

        document.querySelectorAll('section h2').forEach(title => {
            title.addEventListener('click', function() {
                const content = this.nextElementSibling;
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    document.querySelectorAll('section .content').forEach(c => c.style.display = 'none');
                    content.style.display = 'block';
                }
            });
        });
    }
});
