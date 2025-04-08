document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const title = document.querySelector("h1");
    const restartButton = document.getElementById("restartButton");
    const upButton = document.getElementById("upButton");
    const downButton = document.getElementById("downButton");
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");
    const mobileControls = document.getElementById("mobileControls");
 
    // Game variables
    let tileSize = 15;
    let snakeSpeed = tileSize;
    let snakePosX = 0;
    let snakePosY = 0;
    let velocityX = 1;
    let velocityY = 0;
    let tail = [];
    let snakeLength = 4;
    let foodPosX = 0;
    let foodPosY = 0;
    let gameIsRunning = false;
    let gameStarted = false; 
    let fps = 5;
    let score = 0;
 
    // Start game on canvas click
    canvas.addEventListener("click", () => {
        if (!gameIsRunning && !gameStarted) {
            startGame();
        }
    });
 
    // Initialize and start the game
    function startGame() {
        score = 0;
        title.textContent = score;
        snakePosX = 0;
        snakePosY = 0;
        velocityX = 1;
        velocityY = 0;
        tail = [];
        snakeLength = 4;
        gameIsRunning = true;
        gameStarted = true;
        restartButton.style.display = "none";
        mobileControls.style.display = "flex"; // Show mobile controls
        resetFood();
        gameLoop();
    }
 
    // Main game loop
    function gameLoop() {
        if (gameIsRunning) {
            drawStuff();
            moveStuff();
            setTimeout(gameLoop, 1000 / fps);
        }
    }
 
    // Reset food position
    resetFood();
 
    // Move the snake and handle collisions
    function moveStuff() {
        snakePosX += snakeSpeed * velocityX;
        snakePosY += snakeSpeed * velocityY;
 
        // Wall collision handling
        if (snakePosX >= canvas.width) snakePosX = 0;
        if (snakePosX < 0) snakePosX = canvas.width - tileSize;
        if (snakePosY >= canvas.height) snakePosY = 0;
        if (snakePosY < 0) snakePosY = canvas.height - tileSize;
 
        // Self-collision detection
        tail.forEach((snakePart) => {
            if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
                gameOver();
            }
        });
 
        // Update snake's tail
        tail.push({ x: snakePosX, y: snakePosY });
        tail = tail.slice(-snakeLength);
 
        // Check if snake eats the food
        if (snakePosX === foodPosX && snakePosY === foodPosY) {
            snakeLength++;
            title.textContent = ++score;
            resetFood();
        }
    }
 
    // Draw the game elements
    function drawStuff() {
        rectangle("black", 0, 0, canvas.width, canvas.height); // Clear canvas
        drawGrid(); // Draw grid
        rectangle("silver", foodPosX, foodPosY, tileSize, tileSize); // Draw food
        tail.forEach((snakePart) => rectangle("silver", snakePart.x, snakePart.y, tileSize, tileSize)); // Draw snake
        rectangle("silver", snakePosX, snakePosY, tileSize, tileSize); // Draw snake head
    }
 
    // Draw a rectangle on the canvas
    function rectangle(color, x, y, width, height) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }
 
    // Reset food position
    function resetFood() {
        foodPosX = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
        foodPosY = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
        // Ensure food is not placed on the snake
        if (foodPosX === snakePosX && foodPosY === snakePosY) resetFood();
        if (tail.some(snakePart => snakePart.x === foodPosX && snakePart.y === foodPosY)) resetFood();
    }
 
    // Handle game over
    function gameOver() {
        title.innerHTML = `☠️ <strong> ${score} </strong> ☠️`;
        gameIsRunning = false;
        restartButton.style.display = "block";
        mobileControls.style.display = "none"; // Hide mobile controls on game over
    }
 
    // Movement functions for mobile controls
    function moveleft() {
        if (velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        }
    }
 
    function moveup() {
        if (velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        }
    }
 
    function moveright() {
        if (velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }
 
    function movedown() {
        if (velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        }
    }
 
    // Restart game on button click
    var restartBtn = document.getElementById("restartButton");
    restartBtn.onclick = function() {
        restart();
    };
 
    function restart() {
        if (!gameIsRunning){
            startGame();
        } 
    };
 
    // Draw grid on the canvas
    function drawGrid() {
        for (let i = 0; i < canvas.width / tileSize; i++) {
            for (let j = 0; j < canvas.height / tileSize; j++) {
                rectangle("black", i * tileSize, j * tileSize, tileSize - 1, tileSize - 1);
                ctx.strokeStyle = "white";
                ctx.strokeRect(i * tileSize, j * tileSize, tileSize, tileSize);
            }
        }
    }
 
    // Event Listeners for Mobile Controls
    upButton.addEventListener("click", moveup);
    downButton.addEventListener("click", movedown);
    leftButton.addEventListener("click", moveleft);
    rightButton.addEventListener("click", moveright);
});
