const canvasWidth = 600;
const canvasHeight = 400;

let ctx;

let interval = setInterval(updateCanvas, 20);

let player;
let playerYposition = 200;
let fallSpeed = 0;
let isJumping = false;
let jumpSpeed = 0;

let block;
let blockSpeed = 5;

let score = 0;
let scoreLabel;

function main() {
    const canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    gameStart();
}

function gameStart() {
    // Create a player of size 30x30, and initial X position 10
    player = new createPlayer(30, 30, 10);
    block = new createBlock();
    // Create a score label at location 10, 30
    scoreLabel = new createScoreLabel(10, 30);
}

function gameFinish() {
    console.log("GAME OVER!");
    clearInterval(interval);
}

function updateCanvas() {
    detectCollision();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    player.makeFall();
    player.draw();
    player.jump();

    block.move();
    block.draw();

    scoreLabel.draw();
}

function resetJump() {
    jumpSpeed = 0;
    isJumping = false;
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

function createPlayer(width, height, x) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = playerYposition;

    // Create a method to draw the player element
    this.draw = function() {
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Method to simulate gravity
    this.makeFall = function() {
        if (!isJumping) {
            this.y += fallSpeed;
            fallSpeed += 0.1;
            this.stopPlayer();
        }
    }

    this.stopPlayer = function() {
        let ground = canvasHeight - this.height;
        if (this.y > ground) {
            this.y = ground
        }
    }

    this.jump = function() {
        if (isJumping) {
            this.y -= jumpSpeed;
            jumpSpeed += 0.3;
        }
    }
}

function createBlock() {
    this.width = 30;
    this.height = randomInt(300);
    this.x = 800;
    let ground = canvasHeight - this.height;
    this.y = ground;

    this.draw = function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.move = function() {
        this.x -= blockSpeed;
        this.reset();
    }

    this.reset = function() {
        if (this.x < 0) {
            this.height = randomInt(300);
            let ground = canvasHeight - this.height;
            this.x = 800;
            this.y = ground;

            score += 1;
        }
    }
}

function createScoreLabel(x, y) {
    this.x = x;
    this.y = y;
    this.text = "Score: 0";

    this.draw = function() {
        ctx.font = "25px Marker Felt";
        ctx.fillStyle = "black";
        this.text = `Score: ${score}`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

document.body.onkeyup = function(e) {
    // Check if the spacebar was pressed
    if (e.keyCode == 32) {
        isJumping = true;
        setTimeout(function() { resetJump(); }, 1000);
    }
}

main();
