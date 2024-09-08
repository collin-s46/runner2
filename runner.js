const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('gameOverText');

let score = 0;
let gameOver = false;
let obstacleTimer = 0;
let obstacleDelay = Math.random() * 150 + 50;  // Random delay between 50 and 200 frames
let startTime;

const dino = {
    x: 50,
    y: 150,
    width: 50,
    height: 50,
    dy: 0,
    gravity: 1,
    jumpStrength: -15,  
    isJumping: false,
    
    draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    jump() {
        if (!this.isJumping) {
            this.dy = this.jumpStrength;
            this.isJumping = true;
        }
    },
    update() {
        this.y += this.dy;
        this.dy += this.gravity;
        if (this.y > 150) {
            this.y = 150;
            this.isJumping = false;
        }
    }
};

class Obstacle {
    constructor(speed) {
        this.x = canvas.width;
        this.y = 150;
        this.width = 20;
        this.height = 50;
        this.speed = speed;
    }
    draw() {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.x -= this.speed;
    }
}

let obstacles = [];
let obstacleSpeed = 7;  // Start speed

function spawnObstacle() {
    if (obstacleTimer > obstacleDelay) {
        obstacles.push(new Obstacle(obstacleSpeed));
        obstacleTimer = 0;
        obstacleDelay = Math.random() * 150 + 50;  // Randomize the delay again after each spawn
    } else {
        obstacleTimer++;
    }
}

function checkCollision(dino, obstacle) {
    return (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x &&
        dino.y < obstacle.y + obstacle.height &&
        dino.y + dino.height > obstacle.y
    );
}



function restartGame() {
    gameOver = false;
    score = 0;
    startTime = Date.now();  // Track time at restart
    dino.y = 150;
    dino.dy = 0;
    obstacles = [];
    obstacleSpeed = 7;  // Reset speed
    scoreDisplay.textContent = 'Score: 0 ms';
    gameOverText.style.display = 'none';
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dino.draw();
    dino.update();

    spawnObstacle();

    obstacles.forEach((obstacle, index) => {
        obstacle.draw();
        obstacle.update();
        if (checkCollision(dino, obstacle)) {
            gameOver = true;
            gameOverText.style.display = 'block';
        }
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    // Gradually increase the obstacle speed more quickly over time
    obstacleSpeed += 0.0008;

    // Update score in milliseconds
    const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
    score = Math.floor(elapsedTimeInSeconds * 4);
    scoreDisplay.textContent = `Score: ${score} `;

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }

}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (gameOver) {
            restartGame();
            gameLoop();
        } else {
            dino.jump();
        }
    }
});



// Start the game with a defined start time
restartGame();
gameLoop();