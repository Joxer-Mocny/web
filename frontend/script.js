document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for anchor links and center sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior
            const target = document.querySelector(this.getAttribute('href')); // Get target element
            const headerOffset = document.querySelector('header').offsetHeight; // Get header height
            const elementPosition = target.getBoundingClientRect().top; // Get target position
            const offsetPosition = elementPosition + window.scrollY - headerOffset - (window.innerHeight / 2) + (target.offsetHeight / 2);
 
            window.scrollTo({
                top: offsetPosition, // Scroll to calculated position
                behavior: 'smooth' // Smooth scrolling
            });
        });
    });
 
    // Get the modal element
    var modal = document.getElementById("modal");
    var gameContainer = document.getElementById("gameContainer");
    var span = document.getElementsByClassName("close")[0];
 
    // Get the buttons that open the modal
    var snakeBtn = document.getElementById("playSnakeButton");
    var racingBtn = document.getElementById("playRacingButton");
    var swordFightBtn = document.getElementById("playSwordFight");
    var viewHighScoresBtn = document.getElementById("viewHighScoresButton");
 
    // When the user clicks the snake game button, open the modal
    snakeBtn.onclick = function() {
        modal.style.display = "block";
        loadGame('snake');
        disableArrowScroll();
    }
 
    // When the user clicks the racing game button, open the modal
    racingBtn.onclick = function() {
        modal.style.display = "block";
        loadGame('racing');
        disableArrowScroll();
    }
 
    // When the user clicks the sword fighting game button, open the modal
    swordFightBtn.onclick = function() {
        modal.style.display = "block";
        loadGame('swordFight');
        disableArrowScroll();
    }
 
    // When the user clicks the view high scores button, open the modal
    viewHighScoresBtn.onclick = function() {
        modal.style.display = "block";
        loadGame('highScore');
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
    function loadGame(gameType) {
        if (gameType === 'snake') {
            gameContainer.innerHTML = '<iframe src="snake/snake.html" frameborder="0" style="width:100%; height:100%;"></iframe>';
        } else if (gameType === 'racing') {
            gameContainer.innerHTML = '<iframe src="racingCar/racingCar.html" frameborder="0" style="width:100%; height:100%;"></iframe>';
        } else if (gameType === 'swordFight') {
            gameContainer.innerHTML = '<iframe src="swordFight/swordFight.html" frameborder="0" style="width:100%; height:100%;"></iframe>';
        } else if (gameType === 'highScore'){
            gameContainer.innerHTML = '<iframe src="highScore/highScore.html" frameborder="0" style="width:100%; height:100%;"></iframe>'
        }
    }
 

    // Function to unload the game
    function unloadGame() {
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
            e.preventDefault(); // Prevent default scrolling behavior
        }
    }
 
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        document.body.style.backgroundPositionY = -(scrolled * 0.5) + 'px'; // Adjust background position
    });
 
    const menuButton = document.getElementById("menuButton");
    const navMenu = document.getElementById("navMenu");
 
    // Mobile specific code
    if (window.innerWidth <= 768) {
        document.querySelectorAll('section .content').forEach(content => {
            content.style.display = 'none'; // Hide content by default on mobile
        });
 
        document.querySelectorAll('section h2').forEach(title => {
            title.addEventListener('click', function() {
                const content = this.nextElementSibling;
                if (content.style.display === 'block') {
                    content.style.display = 'none'; // Hide content if already visible
                } else {
                    document.querySelectorAll('section .content').forEach(c => c.style.display = 'none'); // Hide other contents
                    content.style.display = 'block'; // Show clicked content
                }
            });
        });
 
        // Toggle menu visibility
        menuButton.addEventListener("click", () => {
            if (navMenu.style.display === "block") {
                navMenu.style.display = "none"; // Hide menu
            } else {
                navMenu.style.display = "block"; // Show menu
            }
        });
 
        // Add click events to menu items to collapse after selection
        navMenu.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', () => {
                navMenu.style.display = 'none'; // Hide menu after selection
            });
        });
    }
 });
 