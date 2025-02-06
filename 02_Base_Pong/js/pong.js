/*
 * Simple clone of Pong
 *
 * Gilberto Echeverria
 * 2025-02-05
 */

"use strict";

// Global variables
const canvasWidth = 600;
const canvasHeight = 400;

let ctx;

let frameStart;
let elapsed;

let paddleLeft;
let paddleRight;
let ball;
let game;

let scoreLabel;

let paddleSpeed = 0.5;
let initalBallSpeed = 0.2;
let ballSpeed = 0.0;
let speedIncrement = 0.05;

let pointsLeft = 0;
let pointsRight = 0;


class Paddle extends GameObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
        this.velocity = new Vec(0.0, 0.0);
    }

    move() {
        this.position = this.position.plus(this.velocity.times(elapsed));
        // Stop motion at the top border
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        // At the bottom border, consider the height of the paddle for the limit
        if (this.position.y > canvasHeight - this.size.y) {
            this.position.y = canvasHeight - this.size.y;
        }
    }
}

class Ball extends GameObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
        this.velocity = this.initVelocity();
        //console.log(`Ball velocity:  ${this.velocity.x}, ${this.velocity.y}`);
    }

    initVelocity() {
        const angle = Math.random() * (Math.PI / 2) - (Math.PI / 4);
        const velX = Math.cos(angle) * (Math.random() < 0.5 ? 1 : -1);
        const velY = Math.sin(angle);
        return new Vec(velX, velY);
    }

    move() {
        // Multiply the motion by a factor called ballSpeed
        this.position = this.position.plus(this.velocity.times(ballSpeed).times(elapsed));
    }
}

class Obstacle extends GameObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
    }
}


class Game {
    constructor(actors, state) {
        this.actors = actors;
        this.state = state;

        this.ball = actors[0];
        this.obstacles = actors.slice(1);

        this.scoreLabel = new TextLabel(canvasWidth*4/10, canvasHeight*8/10);
    }

    update() {
        for (let actor of this.actors) {
            actor.move();
        }

        // Detect collisions
        for (let actor of this.obstacles) {
            if (overlapRectangles(ball, actor)) {
                //console.log(`Collision of ${ball.type} with ${actor.type}`);
                // Invert the direction of the ball's movement
                if (actor.type == 'paddle') {
                    ball.velocity.x *= -1;
                } else if (actor.type == 'wall') {
                    ball.velocity.y *= -1;
                    ballSpeed += speedIncrement;
                } else if (actor.type == 'goalLeft') {
                    pointsRight += 1;
                    this.resetBall();
                    console.log(`Score: ${pointsLeft}, ${pointsRight}`);
                } else if (actor.type == 'goalRight') {
                    pointsLeft += 1;
                    this.resetBall();
                    console.log(`Score: ${pointsLeft}, ${pointsRight}`);
                }
            }
        }
    }

    resetBall() {
        ballSpeed = 0.0;
        ball.position = new Vec(canvasWidth/2, canvasHeight/2);
        ball.velocity = ball.initVelocity();
    }

    draw() {
        for (let actor of this.actors) {
            actor.draw();
        }

        scoreLabel.draw(`Score: ${pointsLeft} - ${pointsRight}`);
    }
}

function main() {
    // Set a callback for when the page is loaded,
    // so that the canvas can be found
    window.onload = init;
}

function init() {
    const canvas = document.getElementById('canvas');
    //const canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    gameStart();
}

function gameStart() {
    // Initialize the game objects
    ball = new Ball("green", 10, 10, canvasWidth/2, canvasHeight/2, 'ball');
    paddleLeft = new Paddle("red", 10, 50, 20, 20, 'paddle');
    paddleRight = new Paddle("red", 10, 50, canvasWidth - 30, 20, 'paddle');
    const wallUp = new Obstacle("black", canvasWidth, 10, 0, 20, 'wall');
    const wallDown = new Obstacle("black", canvasWidth, 10, 0, canvasHeight - 30, 'wall');
    const goalLeft = new Obstacle("yellow", 10, canvasHeight, 0, 0, 'goalLeft');
    const goalRight = new Obstacle("yellow", 10, canvasHeight, canvasWidth-10, 0, 'goalRight');

    // Register the objects in the game
    game = new Game([ball, paddleLeft, paddleRight, wallUp, wallDown, goalLeft, goalRight], 'playing');

    // Place a text object to show the results of the game
    scoreLabel = new TextLabel(canvasWidth*4/10, canvasHeight*8/10);

    setEventListeners();

    // Call the first frame with the current time
    updateCanvas(document.timeline.currentTime);
}

function setEventListeners() {
    window.addEventListener("keydown", event => {
        if (event.key == 'q') {
            paddleLeft.velocity.y = -paddleSpeed;
        }
        if (event.key == 'a') {
            paddleLeft.velocity.y = paddleSpeed;
        }
        if (event.key == 'o') {
            paddleRight.velocity.y = -paddleSpeed;
        }
        if (event.key == 'l') {
            paddleRight.velocity.y = paddleSpeed;
        }
    });

    window.addEventListener("keyup", event => {
        if (event.key == 'q') {
            paddleLeft.velocity.y = 0.0;
        }
        if (event.key == 'a') {
            paddleLeft.velocity.y = 0.0;
        }
        if (event.key == 'o') {
            paddleRight.velocity.y = 0.0;
        }
        if (event.key == 'l') {
            paddleRight.velocity.y = 0.0;
        }

        // Start the game when pressing g
        if (event.key == 'g') {
            if (ballSpeed == 0.0) {
                ballSpeed = initalBallSpeed;
            }
        }
    });
}

// Function that will be called for the game loop
function updateCanvas(frameTime) {
    if (frameStart === undefined) {
        frameStart = frameTime;
    }
    elapsed = frameTime - frameStart;
    //console.log(`Elapsed: ${elapsed}`);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update();
    game.draw();

    frameStart = frameTime;
    requestAnimationFrame(updateCanvas);
}

// Call the start function to initiate the game
main();
