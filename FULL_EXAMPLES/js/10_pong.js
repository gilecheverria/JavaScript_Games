/*
 * Implementation of the game of Pong
 *
 * Gilberto Echeverria
 * 2025-02-25
 */

"use strict";

import { Vector } from "./libs/Vector";
import { GameObject } from "./libs/GameObject";
import { TextLabel } from "./libs/TextLabel";
import { boxOverlap } from "./libs/game_functions";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Variable to store the times for the frames
let oldTime;

// Global settings
const paddleSpeed = 0.8;
const speedIncrease = 1.05;
const initialSpeed = 0.3;
const flashDuration = 500;
let flashElapsed = 0;

// Context of the Canvas
let ctx;

// The game object
let game;

// Clases for the Pong game
class Ball extends GameObject {
    constructor( { position, width, height, color } ) {
        super( {
            position: position,
            width: width,
            height: height,
            color: color,
            type: "ball"
        } );
        this.reset();
    }

    update(deltaTime) {
        // Update the position using a constant velocity
        this.position = this.position.plus(this.velocity.times(deltaTime));
        this.updateCollider();
    }

    serve() {
        this.inPlay = true;
        let angle = Math.random() * (Math.PI / 2) - (Math.PI / 4);
        this.velocity = new Vector(Math.cos(angle), Math.sin(angle)).times(initialSpeed);
        // Select a random direction for the serve
        this.velocity.x *= (Math.random() < 0.5) ? 1 : -1;
    }

    reset() {
        this.inPlay = false;
        this.position = new Vector(canvasWidth / 2, canvasHeight / 2);
        this.velocity = new Vector(0, 0);
    }
}

class Paddle extends GameObject {
    constructor( { position, width, height, color } ) {
        super( {
            position: position,
            width: width,
            height: height,
            color: color,
            type: "paddle"
        } );
        this.velocity = new Vector(0.0, 0.0);

        this.motion = {
            up: {
                axis: "y",
                sign: -1,
            },
            down: {
                axis: "y",
                sign: 1,
            },
        }

        // Keys pressed to move the player
        this.keys = [];
    }

    update(deltaTime) {
        // Restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }
        // Multiply the velocity vector by the speed value
        this.velocity = this.velocity.times(paddleSpeed);
        // Move the paddle
        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
        this.updateCollider();
    }

    clampWithinCanvas() {
        // Top border
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y;
        }
        // Bottom border
        if (this.position.y + this.halfSize.y > canvasHeight) {
            this.position.y = canvasHeight - this.halfSize.y;
        }
    }
}

// Class that controls all the objects in the game
class Game {
    constructor(canvasWidth, canvasHeight) {
        this.scoreLeft = 0;
        this.scoreRight = 0;

        // List for the objects in the scene
        this.actors = [];

        // Flag to indicate when a goal has been scored
        this.newScore = false;
        this.scorePlayer = undefined;

        // Text labels to show the game score
        this.labelLeft = new TextLabel(200, 100, "40px Ubuntu Mono", "red");
        this.labelRight = new TextLabel(600, 100, "40px Ubuntu Mono", "blue");

        this.initObjects();
        this.initAudio();
        this.createEventListeners();
    }

    initObjects() {
        // A simble GameObject for the background
        this.bg = new GameObject( {
            position: new Vector(canvasWidth / 2, canvasHeight / 2),
            width: canvasWidth,
            height: canvasHeight,
            color: "black",
            type: "background"
        });
        // An object to represent the box to be displayed
        this.ball = new Ball( {
            position: new Vector(canvasWidth / 2, canvasHeight / 2),
            width: 20,
            height: 20,
            color: "white",
            type: "ball"
        } );
        // The paddles that will be controlled by the players
        this.paddleLeft = new Paddle( {
            position: new Vector(30, canvasHeight / 2),
            width: 20,
            height: 100,
            color: "red",
            type: "paddle"
        });
        this.paddleRight = new Paddle( {
            position: new Vector(canvasWidth - 50, canvasHeight / 2),
            width: 20,
            height: 100,
            color: "blue",
            type: "paddle"
        });
        // Top and bottom bars where the ball can bounce
        this.wallTop = new GameObject( {
            position: new Vector(canvasWidth / 2, 0),
            width: canvasWidth,
            height: 20,
            color: "yellow",
            type: "wall"
        });
        this.wallBottom = new GameObject( {
            position: new Vector(canvasWidth / 2, canvasHeight),
            width: canvasWidth,
            height: 20,
            color: "yellow",
            type: "wall"
        });
        // Goals on the sides. If the ball touches them a player scores
        this.goalLeft = new GameObject( {
            position: new Vector(0, canvasHeight / 2),
            width: 10,
            height: canvasHeight,
            color: "green",
            type: "leftGoal"
        });
        this.goalRight = new GameObject( {
            position: new Vector(canvasWidth, canvasHeight / 2),
            width: 10,
            height: canvasHeight,
            color: "green",
            type: "rightGoal"
        });

        // Add the new objects to the list of actors
        // The order is important. Objects will be drawn from the back to the front
        this.actors = [
            this.goalLeft,
            this.goalRight,
            this.wallTop,
            this.wallBottom,
            this.paddleLeft,
            this.paddleRight,
            this.ball,
        ];
    }

    initAudio() {
        // Add audio elements
        this.ping = document.createElement("audio");
        this.ping.src = "../assets/audio/4384__noisecollector__pongblipd4.wav";

        this.pong = document.createElement("audio");
        this.pong.src = "../assets/audio/4390__noisecollector__pongblipf4.wav";

        this.scoreChime = document.createElement("audio");
        this.scoreChime.src = "../assets/audio/420512__jfrecords__vmax-bells.wav";
    }

    update(deltaTime) {
        // Only updte background color when a player has just scored
        if (this.newScore) {
            this.flashScore(deltaTime);
            return;
        }

        // Update the positions of the objects
        this.ball.update(deltaTime);
        this.paddleLeft.update(deltaTime);
        this.paddleRight.update(deltaTime);

        // Identify if the ball hits a paddle, then bounce back horizontally
        if (boxOverlap(this.ball.collider, this.paddleLeft.collider)
            || boxOverlap(this.ball.collider, this.paddleRight.collider)) {
            this.ball.velocity.x *= -1;
            this.ball.velocity = this.ball.velocity.times(speedIncrease);
            this.ping.play();
        }
        // If the ball hits a wall, bounce back vertically
        if (boxOverlap(this.ball.collider, this.wallTop.collider)
            || boxOverlap(this.ball.collider, this.wallBottom.collider)) {
            this.ball.velocity.y *= -1;
            this.ball.velocity = this.ball.velocity.times(speedIncrease);
            this.pong.play();
        }
        // Score when the ball hits a goal
        if (boxOverlap(this.ball.collider, this.goalLeft.collider)) {
            this.scoreRight += 1;
            this.scoreChime.play();
            this.newScore = true;
            this.scorePlayer = "right";
        }
        if (boxOverlap(this.ball.collider, this.goalRight.collider)) {
            this.scoreLeft += 1;
            this.scoreChime.play();
            this.newScore = true;
            this.scorePlayer = "left";
        }
    }

    draw(ctx) {
        // The background is drawn first
        this.bg.draw(ctx);

        // Draw the background objects first
        this.labelLeft.draw(ctx, `${this.scoreLeft}`);
        this.labelRight.draw(ctx, `${this.scoreRight}`);

        // Drall all actors in a loop
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
    }

    // Function to change the color of the background,
    // depending on the side that scored
    flashScore(deltaTime) {
        flashElapsed += deltaTime;
        // Stop the animation and restore the game when the animation time has ended
        if (flashElapsed > flashDuration) {
            flashElapsed = 0;
            this.ball.reset();
            this.newScore = false;
            this.bg.color = `rgb(0 0 0)`;
        } else {
            let targetColor = this.scorePlayer === "left" ? [200, 100, 100] : [100, 100, 200];
            let newColor = this.lerpColor([0, 0, 0], targetColor, flashElapsed / flashDuration);
            this.bg.color = `rgb(${Math.floor(newColor[0])} ${Math.floor(newColor[1])} ${Math.floor(newColor[2])})`;
            //console.log(`new color: ${newColor} : ${this.bg.color}`);
        }
    }

    // Lerp a color.
    // Receive two list of the three color values in RGB, and the t factor
    lerpColor(startColor, targetColor, t) {
        let newColor = [0, 0, 0];
        for (let i in startColor) {
            newColor[i] = this.lerpValue(startColor[i], targetColor[i], t);
        }
        return newColor;
    }

    lerpValue(startValue, targetValue, t) {
        return startValue + (targetValue - startValue) * t;
    }

    createEventListeners() {

        window.addEventListener('keydown', (event) => {
            if (event.key == 'w') {
                this.addKey('up', this.paddleLeft);
            }
            if (event.key == 's') {
                this.addKey('down', this.paddleLeft);
            }
            if (event.key == 'o' || event.key == 'ArrowUp') {
                this.addKey('up', this.paddleRight);
            }
            if (event.key == 'l' || event.key == 'ArrowDown') {
                this.addKey('down', this.paddleRight);
            }

            // Add a key for the initial serve of the ball
            if (event.code == 'Space') {
                if (!this.ball.inPlay) {
                    this.ball.serve();
                }
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.delKey('up', this.paddleLeft);
            }
            if (event.key == 's') {
                this.delKey('down', this.paddleLeft);
            }
            if (event.key == 'o' || event.key == 'ArrowUp') {
                this.delKey('up', this.paddleRight);
            }
            if (event.key == 'l' || event.key == 'ArrowDown') {
                this.delKey('down', this.paddleRight);
            }
        });
    }

    addKey(direction, paddle) {
        if (!paddle.keys.includes(direction)) {
            paddle.keys.push(direction);
        }
    }

    delKey(direction, paddle) {
        if (paddle.keys.includes(direction)) {
            paddle.keys.splice(paddle.keys.indexOf(direction), 1);
        }
    }
}


function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    game = new Game(canvasWidth, canvasHeight);

    drawScene(0);
}

function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;
    //console.log(`DeltaTime: ${deltaTime}`);

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update all game objects
    game.update(deltaTime);

    // Draw all game objects
    game.draw(ctx);

    // Update the time for the next frame
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}


main();
