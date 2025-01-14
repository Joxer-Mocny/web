document.addEventListener("DOMContentLoaded", () => {
    // Get references to the canvas and its context
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    // Get reference to the start button
    const startButton = document.getElementById("startButton");
 
    // Initialize game variables
    let carX = canvas.width / 2 - 15;
    let carY = canvas.height - 60;
    let carWidth = 30;
    let carHeight = 60;
    let velocityX = 0;
    let obstacles = [];
    let bullets = [];
    let ammo = 1; // Start with one ammo
    let gameIsRunning = false;
    let score = 0;
 
    // Function to start the game
    function startGame() {
        // Reset game variables
        carX = canvas.width / 2 - 15;
        carY = canvas.height - 60;
        velocityX = 0;
        obstacles = [];
        bullets = [];
        ammo = 1; // Reset ammo to one at the start
        score = 0;
        gameIsRunning = true;
        // Hide start button
        startButton.style.display = "none";
        // Start the game loop
        gameLoop();
    }
 
    // Main game loop
    function gameLoop() {
        if (gameIsRunning) {
            updateGame(); // Update game state
            drawGame();   // Draw game state
            requestAnimationFrame(gameLoop); // Continue the loop
        }
    }
 
    // Update game state
    function updateGame() {
        // Update car position
        carX += velocityX;
        if (carX < 0) carX = 0;
        if (carX + carWidth > canvas.width) carX = canvas.width - carWidth;
 
        // Randomly generate obstacles
        if (Math.random() < 0.02) {
            let obstacleX = Math.random() * (canvas.width - carWidth);
            let newObstacle = { x: obstacleX, y: 0, width: carWidth, height: carHeight };
            
            // Check for overlap with existing obstacles
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
 
        // Update obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.y += 1;
            if (obstacle.y > canvas.height) {
                obstacles.splice(index, 1); // Remove off-screen obstacles
                score++;
                if (score % 10 === 0) {
                    ammo++; // Add ammo every 10 obstacles passed
                }
            }
            // Check for collision with the car
            if (carX < obstacle.x + obstacle.width &&
                carX + carWidth > obstacle.x &&
                carY < obstacle.y + obstacle.height &&
                carY + carHeight > obstacle.y) {
                gameOver();
            }
        });
 
        // Update bullets
        bullets.forEach((bullet, bulletIndex) => {
            bullet.y -= 5;
            if (bullet.y < 0) {
                bullets.splice(bulletIndex, 1); // Remove off-screen bullets
            }
            // Check for collision with obstacles
            obstacles.forEach((obstacle, obstacleIndex) => {
                if (bullet.x < obstacle.x + obstacle.width &&
                    bullet.x + bullet.width > obstacle.x &&
                    bullet.y < obstacle.y + obstacle.height &&
                    bullet.y + bullet.height > obstacle.y) {
                    obstacles.splice(obstacleIndex, 1); // Remove hit obstacle
                    bullets.splice(bulletIndex, 1); // Remove bullet
                    score++;
                    if (score % 10 === 0) {
                        ammo++; // Add ammo every 10 obstacles passed
                    }
                }
            });
        });
    }
 
    // Draw game state
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
 
        // Draw the player's car
        ctx.fillStyle = "red";
        ctx.fillRect(carX, carY, carWidth, carHeight);
 
        // Draw wheels for the player's car
        ctx.fillStyle = "black";
        const wheelWidth = 10;
        const wheelHeight = 20;
        // Front wheels
        ctx.fillRect(carX, carY, wheelWidth, wheelHeight);
        ctx.fillRect(carX + carWidth - wheelWidth, carY, wheelWidth, wheelHeight);
        // Rear wheels
        ctx.fillRect(carX, carY + carHeight - wheelHeight, wheelWidth, wheelHeight);
        ctx.fillRect(carX + carWidth - wheelWidth, carY + carHeight - wheelHeight, wheelWidth, wheelHeight);
 
        // Draw obstacles
        obstacles.forEach(obstacle => {
            ctx.fillStyle = "grey";
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
 
            // Draw wheels for obstacles
            ctx.fillStyle = "black";
            // Front wheels
            ctx.fillRect(obstacle.x, obstacle.y, wheelWidth, wheelHeight);
            ctx.fillRect(obstacle.x + obstacle.width - wheelWidth, obstacle.y, wheelWidth, wheelHeight);
            // Rear wheels
            ctx.fillRect(obstacle.x, obstacle.y + obstacle.height - wheelHeight, wheelWidth, wheelHeight);
            ctx.fillRect(obstacle.x + obstacle.width - wheelWidth, obstacle.y + obstacle.height - wheelHeight, wheelWidth, wheelHeight);
        });
 
        // Draw bullets
        ctx.fillStyle = "yellow";
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
 
        // Draw score and ammo
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 20);
        ctx.fillText("Ammo: " + ammo, 10, 40);
    }
 
    // Handle game over
    function gameOver() {
        gameIsRunning = false;
        startButton.style.display = "block";
    }
 
    // Event listeners for keyboard controls
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            velocityX = -5; // Move left
        } else if (event.key === "ArrowRight") {
            velocityX = 5; // Move right
        } else if (event.key === " " && ammo > 0) { // Space key for shooting
            bullets.push({ x: carX + carWidth / 2 - 2, y: carY, width: 4, height: 10 });
            ammo--;
        }
    });
 
    document.addEventListener("keyup", () => {
        velocityX = 0; // Stop moving when the key is released
    });
 
    // Start the game when the start button is clicked
    startButton.onclick = startGame;
 });
 