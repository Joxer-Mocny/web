document.addEventListener("DOMContentLoaded", () => {
    // Get references to the canvas and its context
    // Canvas element and context
const canvas = document.querySelector("canvas");
    // 2D rendering context
const ctx = canvas.getContext("2d");
    // Get references to the buttons and instructions
    // Start button element
const startButton = document.getElementById("startButton");
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");
    const shootButton = document.getElementById("shoot");
    const instructions = document.getElementById("instructions");
    // Get reference to the mobile controls container
    const mobileControls = document.getElementById("mobileControls");
 
    // Initialize game variables
    let carX = canvas.width / 2 - 15;
    let carY = canvas.height - 60;
    let carWidth = 30;
    let carHeight = 60;
    let velocityX = 0;
    let obstacles = [];
    let bullets = [];
    // Game running status
let gameIsRunning = false;
    let score = 0;
    let ammo = 1;
 
    // Function to start the game
    // Function to start the game
function startGame() {
        // Reset game variables
        carX = canvas.width / 2 - 15;
        carY = canvas.height - 60;
        velocityX = 0;
        obstacles = [];
        bullets = [];
        ammo = 1;
        score = 0;
        gameIsRunning = true;
        // Hide start button and instructions, show mobile controls
        startButton.style.display = "none";
        instructions.style.display = "none";
        mobileControls.style.display = "block"; 
        // Start the game loop
        gameLoop();
    }
 
    // Main game loop
    // Main game loop
function gameLoop() {
        if (gameIsRunning) {
            updateGame(); // Update game state
            drawGame();   // Draw game state
            requestAnimationFrame(gameLoop); // Continue the loop
        }
    }
 
    // Update game state
    // Function to update the game state
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
                obstacles.shift(); // Remove off-screen obstacles
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
        const wheelHeight = 18;
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
    // Function to handle game over state
function gameOver() {
        gameIsRunning = false;
        startButton.style.display = "block";
        mobileControls.style.display = "none"; 
    }
 
    // Event listeners for mobile controls
    leftButton.addEventListener("touchstart", () => {
        velocityX = -2; // Start moving left
    });
 
    rightButton.addEventListener("touchstart", () => {
        velocityX = 2; // Start moving right
    });
 
    document.addEventListener("touchend", () => {
        velocityX = 0; // Stop moving when the touch ends
    });
 
    shootButton.addEventListener("click", () => {
        if (ammo > 0) {
            shootBullet();
        }
    });
 
    // Function to shoot a bullet
    function shootBullet() {
        bullets.push({ x: carX + carWidth / 2 - 2, y: carY, width: 4, height: 10 });
        ammo--;
    }
 
    // Start the game when the start button is clicked
    startButton.onclick = startGame;
 });
 