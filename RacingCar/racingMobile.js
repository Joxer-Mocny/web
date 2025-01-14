document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById("startButton");
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");
    const shootButton = document.getElementById("shoot"); // Correct reference to the shoot button
    const instructions = document.getElementById("instructions");
 
    let carX = canvas.width / 2 - 15;
    let carY = canvas.height - 60;
    let carWidth = 30;
    let carHeight = 60;
    let velocityX = 0;
    let obstacles = [];
    let bullets = [];
    let gameIsRunning = false;
    let score = 0;
    let ammo = 1;
 
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
        instructions.style.display = "none";
        mobileControls.style.display = "block"; 
        gameLoop();
    }
 
    function gameLoop() {
        if (gameIsRunning) {
            updateGame();
            drawGame();
            requestAnimationFrame(gameLoop);
        }
    }
 
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
                obstacles.shift();
                score++;
                if (score % 10 === 0) {
                    ammo++; // Add ammo every 10 obstacles passed
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
                        ammo++; // Add ammo every 10 obstacles passed
                    }
                }
            });
        });
    }
 
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
 
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 20);
        ctx.fillText("Ammo: " + ammo, 10, 40);
    }
 
    function gameOver() {
        gameIsRunning = false;
        startButton.style.display = "block";
        mobileControls.style.display = "none"; 
    }
 
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
 
    function shootBullet() {
        bullets.push({ x: carX + carWidth / 2 - 2, y: carY, width: 4, height: 10 });
        ammo--;
    }
 
    startButton.onclick = startGame;
 });
 