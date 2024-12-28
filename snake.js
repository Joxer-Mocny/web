document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const title = document.querySelector("h1");
    const restartButton = document.getElementById("restartButton");
 
    // Check if all required elements are present
    if (!canvas || !ctx || !title || !restartButton) {
        console.error("Required elements are missing from the DOM");
        return;
    }
 
    // Game variables
    let tileSize = 20;
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
    let fps = 10;
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
    }
 
    // Handle keyboard input for snake movement
    document.addEventListener("keydown", keyPush);
    function keyPush(event) {
        switch (event.key) {
            case "ArrowLeft":
                if (velocityX !== 1) {
                    velocityX = -1;
                    velocityY = 0;
                }
                break;
            case "ArrowUp":
                if (velocityY !== 1) {
                    velocityX = 0;
                    velocityY = -1;
                }
                break;
            case "ArrowRight":
                if (velocityX !== -1) {
                    velocityX = 1;
                    velocityY = 0;
                }
                break;
            case "ArrowDown":
                if (velocityY !== -1) {
                    velocityX = 0;
                    velocityY = 1;
                }
                break;
            default:
                if (!gameIsRunning) location.reload(); // Reload page to restart game
                break;
        }
        // Prevent default behavior (scrolling)
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
        }
    }
 
    // Restart game on button click
    const restartBtn = document.getElementById("restartButton");
    restartBtn.onclick = function() {
        if (!gameIsRunning) {
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
 });
 