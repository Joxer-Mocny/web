document.addEventListener("DOMContentLoaded", () => {
    // Get references to the canvas and its context
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById("startButton");
    const highScorePopup = document.getElementById("highScorePopup");
    const newScoreSpan = document.getElementById("newScore");
    const playerNameInput = document.getElementById("playerName");
    const submitHighScoreButton = document.getElementById("submitHighScore");
 
    // Initialize game variables
    let carX = canvas.width / 2 - 15;
    let carY = canvas.height - 60;
    let carWidth = 30;
    let carHeight = 60;
    let velocityX = 0;
    let obstacles = [];
    let bullets = [];
    let ammo = 1;
    let gameIsRunning = false;
    let score = 0;
 
    // Function to start the game
    function startGame() {
        carX = canvas.width / 2 - 15;
        carY = canvas.height - 60;
        velocityX = 0;
        obstacles = [];
        bullets = [];
        ammo = 1;
        score = 0;
        gameIsRunning = true;
        startButton.style.display = "none";
        gameLoop();
    }
 
    // Main game loop
    function gameLoop() {
        if (gameIsRunning) {
            updateGame();
            drawGame();
            requestAnimationFrame(gameLoop);
        }
    }
 
    // Update game state
    function updateGame() {
        carX += velocityX;
        if (carX < 0) carX = 0;
        if (carX + carWidth > canvas.width) carX = canvas.width - carWidth;
 
        if (Math.random() < 0.02) {
            let obstacleX = Math.random() * (canvas.width - carWidth);
            let newObstacle = { x: obstacleX, y: 0, width: carWidth, height: carHeight };
            let overlap = obstacles.some(obstacle => {
                return newObstacle.x < obstacle.x + obstacle.width &&
                       newObstacle.x + newObstacle.width > obstacle.x &&
                       newObstacle.y < obstacle.y + obstacle.height &&
                       newObstacle.y + newObstacle.height > obstacle.y;
            });
            if (!overlap) {
                obstacles.push(newObstacle);
            }
        }
 
        obstacles.forEach((obstacle, index) => {
            obstacle.y += 1;
            if (obstacle.y > canvas.height) {
                obstacles.splice(index, 1);
                score++;
                if (score % 10 === 0) {
                    ammo++;
                }
            }
            if (carX < obstacle.x + obstacle.width &&
                carX + carWidth > obstacle.x &&
                carY < obstacle.y + obstacle.height &&
                carY + carHeight > obstacle.y) {
                gameOver();
            }
        });
 
        bullets.forEach((bullet, bulletIndex) => {
            bullet.y -= 5;
            if (bullet.y < 0) {
                bullets.splice(bulletIndex, 1);
            }
            obstacles.forEach((obstacle, obstacleIndex) => {
                if (bullet.x < obstacle.x + obstacle.width &&
                    bullet.x + bullet.width > obstacle.x &&
                    bullet.y < obstacle.y + obstacle.height &&
                    bullet.y + bullet.height > obstacle.y) {
                    obstacles.splice(obstacleIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    score++;
                    if (score % 10 === 0) {
                        ammo++;
                    }
                }
            });
        });
    }
 
    // Draw game state
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.fillRect(carX, carY, carWidth, carHeight);
        ctx.fillStyle = "black";
        const wheelWidth = 10;
        const wheelHeight = 20;
        ctx.fillRect(carX, carY, wheelWidth, wheelHeight);
        ctx.fillRect(carX + carWidth - wheelWidth, carY, wheelWidth, wheelHeight);
        ctx.fillRect(carX, carY + carHeight - wheelHeight, wheelWidth, wheelHeight);
        ctx.fillRect(carX + carWidth - wheelWidth, carY + carHeight - wheelHeight, wheelWidth, wheelHeight);
 
        obstacles.forEach(obstacle => {
            ctx.fillStyle = "grey";
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            ctx.fillStyle = "black";
            ctx.fillRect(obstacle.x, obstacle.y, wheelWidth, wheelHeight);
            ctx.fillRect(obstacle.x + obstacle.width - wheelWidth, obstacle.y, wheelWidth, wheelHeight);
            ctx.fillRect(obstacle.x, obstacle.y + obstacle.height - wheelHeight, wheelWidth, wheelHeight);
            ctx.fillRect(obstacle.x + obstacle.width - wheelWidth, obstacle.y + obstacle.height - wheelHeight, wheelWidth, wheelHeight);
        });
 
        ctx.fillStyle = "yellow";
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
 
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 20);
        ctx.fillText("Ammo: " + ammo, 10, 40);
    }
 
    // Handle game over
    function gameOver() {
        gameIsRunning = false;
        startButton.style.display = "block";
 
        checkHighScore(score, 'racing', (newHighScore) => {
            newScoreSpan.textContent = newHighScore;
            highScorePopup.style.display = "block";
        });
    }
 
    submitHighScoreButton.onclick = function() {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            submitHighScore('racing', playerName, score);
        } else {
            alert('Please enter your name');
        }
    };
 
    // Event listeners for keyboard controls
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            velocityX = -5;
        } else if (event.key === "ArrowRight") {
            velocityX = 5;
        } else if (event.key === " " && ammo > 0) {
            bullets.push({ x: carX + carWidth / 2 - 2, y: carY, width: 4, height: 10 });
            ammo--;
        }
    });
 
    document.addEventListener("keyup", () => {
        velocityX = 0;
    });
 
    startButton.onclick = startGame;
 });
 