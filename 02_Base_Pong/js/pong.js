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

let oldTime;

let game;

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

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));
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

    update(deltaTime) {
        // Multiply the motion by a factor called ballSpeed
        this.position = this.position.plus(this.velocity.times(ballSpeed).times(deltaTime));
    }

    resetPosition() {
        ballSpeed = 0.0;
        this.position = new Vec(canvasWidth / 2, canvasHeight / 2);
        this.velocity = this.initVelocity();
    }
}


class Obstacle extends GameObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
    }
}


class Game {
    constructor(state) {
        this.state = state;

        this.initObjects();

        this.setEventListeners();

        this.scoreLabelLeft = new TextLabel(canvasWidth * 3 / 10,
                                            canvasHeight * 2 / 10,
                                            "40px Ubuntu Mono",
                                            "white");
        this.scoreLabelRight = new TextLabel(canvasWidth * 7 / 10,
                                             canvasHeight * 2 / 10,
                                             "40px Ubuntu Mono",
                                             "white");
    }

    update(deltaTime) {
        for (let actor of this.actors) {
            actor.update(deltaTime);
        }

        // Detect collisions
        for (let actor of this.obstacles) {
            if (overlapRectangles(this.ball, actor)) {
                //console.log(`Collision of ${ball.type} with ${actor.type}`);
                // Invert the direction of the ball's movement
                if (actor.type == 'paddle') {
                    this.ball.velocity.x *= -1;
                } else if (actor.type == 'wall') {
                    this.ball.velocity.y *= -1;
                    ballSpeed += speedIncrement;
                } else if (actor.type == 'goalLeft') {
                    pointsRight += 1;
                    this.ball.resetPosition();
                    console.log(`Score: ${pointsLeft}, ${pointsRight}`);
                } else if (actor.type == 'goalRight') {
                    pointsLeft += 1;
                    this.ball.resetPosition();
                    console.log(`Score: ${pointsLeft}, ${pointsRight}`);
                }
            }
        }
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }

        this.scoreLabelLeft.draw(ctx, `${pointsLeft}`);
        this.scoreLabelRight.draw(ctx, `${pointsRight}`);
    }

    // Initialize the game objects
    initObjects() {
        this.ball = new Ball("green", 10, 10, canvasWidth / 2, canvasHeight / 2, 'ball');
        this.paddleLeft = new Paddle("red", 10, 50, 20, canvasHeight / 2, 'paddle');
        this.paddleRight = new Paddle("red", 10, 50, canvasWidth - 30, canvasHeight / 2, 'paddle');
        this.wallUp = new Obstacle("#ffffff", canvasWidth, 10, 0, 20, 'wall');
        this.wallDown = new Obstacle("#ffffff", canvasWidth, 10, 0, canvasHeight - 30, 'wall');
        this.goalLeft = new Obstacle("yellow", 10, canvasHeight, 0, 0, 'goalLeft');
        this.goalRight = new Obstacle("yellow", 10, canvasHeight, canvasWidth - 10, 0, 'goalRight');

        // Lists to iterate over all objects
        this.obstacles = [this.paddleLeft, this.paddleRight,
                          this.wallUp, this.wallDown,
                          this.goalLeft, this.goalRight]
        this.actors = [this.ball].concat(this.obstacles);
    }

    setEventListeners() {
        window.addEventListener("keydown", event => {
            if (event.key == 'q') {
                this.paddleLeft.velocity.y = -paddleSpeed;
            }
            if (event.key == 'a') {
                this.paddleLeft.velocity.y = paddleSpeed;
            }
            if (event.key == 'o') {
                this.paddleRight.velocity.y = -paddleSpeed;
            }
            if (event.key == 'l') {
                this.paddleRight.velocity.y = paddleSpeed;
            }
        });

        window.addEventListener("keyup", event => {
            if (event.key == 'q') {
                this.paddleLeft.velocity.y = 0.0;
            }
            if (event.key == 'a') {
                this.paddleLeft.velocity.y = 0.0;
            }
            if (event.key == 'o') {
                this.paddleRight.velocity.y = 0.0;
            }
            if (event.key == 'l') {
                this.paddleRight.velocity.y = 0.0;
            }

            // Start the game when pressing g
            if (event.key == 'g') {
                if (ballSpeed == 0.0) {
                    ballSpeed = initalBallSpeed;
                }
            }
        });
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
    // Register the objects in the game
    game = new Game('playing');

    // Call the first frame with the current time
    updateCanvas(document.timeline.currentTime);
}

// Function that will be called for the game loop
function updateCanvas(newTime) {
    if (oldTime === undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;
    //console.log(`deltaTime: ${deltaTime}`);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(updateCanvas);
}

// Call the start function to initiate the game
main();
