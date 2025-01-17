/*
 * Simple game to avoid obstacles by jumping.
 * Based on the example at:
 * https://www.codewizardshq.com/javascript-games/
 *
 * Gilberto Echeverria
 * 2025-01-13
 */

const canvasWidth = 600;
const canvasHeight = 400;

let ctx;

// Game variables
let frames = 0;
let minBlockSpeed = 4;
let maxBlockSpeed = 5;
let score = 0;
let level = 1;
let isPlaying = false;

// Object instances
let player;
let block;
let scoreLabel;
let difficultyLabel;

class Player {
    constructor(width, height, x) {
        this.width = width;
        this.height = height;
        this.x = x;
        const ground = canvasHeight - this.height;
        this.y = ground;

        this.isJumping = false;
        this.yVelocity = 0;
    } 

    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        if (this.isJumping) {
            this.y -= this.yVelocity;
            this.yVelocity -= 1;
            this.stopPlayer();
        }
    }

    stopPlayer() {
        const ground = canvasHeight - this.height;
        if (this.y > ground) {
            this.y = ground
            this.yVelocity = 0;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.yVelocity = 26;
            this.isJumping = true;
        }
    }
}

class Block {
    constructor() {
        this.width = 30;
        this.height = randomInt(50, 300);
        this.x = 800;
        const ground = canvasHeight - this.height;
        this.y = ground;
        this.blockSpeed = randomInt(minBlockSpeed, maxBlockSpeed);
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.x -= this.blockSpeed;
        this.reset();
    }

    reset() {
        if (this.x < -this.width) {
            this.height = randomInt(50, 300);
            const ground = canvasHeight - this.height;
            this.x = 800;
            this.y = ground;
            this.blockSpeed = randomInt(minBlockSpeed, maxBlockSpeed);

            this.addPoint();
        }
    }

    addPoint() {
            // Add a point for each block that reaches the end without
            // hitting the player
            score += 1;
            if (score > 0 && score % 5 == 0) {
                level += 1;
                minBlockSpeed += 0.5;
                maxBlockSpeed += 1;
            }
    }   
}

class TextLabel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(text) {
        ctx.font = "25px Marker Felt";
        ctx.fillStyle = "black";
        ctx.fillText(text, this.x, this.y);
    }
}

function main() {
    const canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    gameStart();
}

function gameStart() {
    // Reset game variables
    minBlockSpeed = 4;
    maxBlockSpeed = 5;
    score = 0;
    level = 1;
    isPlaying = true;

    // Create a player of size 30x30, and initial X position 10
    player = new Player(30, 30, 10);
    block = new Block();
    // Create a score label at location 10, 30
    scoreLabel = new TextLabel(10, 30);
    difficultyLabel = new TextLabel(400, 30);

    updateCanvas();
}

function gameFinish() {
    console.log("GAME OVER!");
    isPlaying = false;
}

function updateCanvas() {
    frames += 1;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    player.move();
    player.draw();

    block.move();
    block.draw();

    scoreLabel.draw(`Score: ${score}`);
    difficultyLabel.draw(`Level: ${level}`);

    detectCollision();

    if (isPlaying) {
        requestAnimationFrame(updateCanvas);
    }
}

function detectCollision () {
    const playerLeft = player.x;
    const playerRight = playerLeft + player.width;
    const playerBottom = player.y + player.height;

    const blockLeft = block.x;
    const blockRight = blockLeft + block.width;
    const blockTop = block.y;

    if (playerRight > blockLeft &&
        playerLeft < blockRight &&
        playerBottom > blockTop) {
        gameFinish();
    }
}

function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

document.body.onkeyup = function(e) {
    // Check if the spacebar was pressed
    if (e.keyCode == 32) {
        player.jump();
    }
    // Reset the game by pressing 'r'
    if (e.keyCode == 82) {
        gameStart();
    }
}

main();
