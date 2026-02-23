/*
 * Detection of collisions between boxes
 *
 * Gilberto Echeverria
 * 2025-03-13
 */

"use strict";

import { Vector } from "./libs/Vector";
import { GameObject } from "./libs/GameObject";
import { Player } from "./libs/Player";
import { boxOverlap, randomRange } from "./libs/game_functions";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime;

let playerSpeed = 0.5;


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();
    }

    initObjects() {
        this.player = new Player(new Vector(canvasWidth / 2, canvasHeight / 2), 60, 60, "red");
        this.player.setSpeed(playerSpeed);

        this.actors = [];
        for (let i=0; i<10; i++) {
            this.addBox();
        }
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        this.player.draw(ctx);
    }

    update(deltaTime) {
        // Move the player
        this.player.update(deltaTime, ctx.canvas);

        // Check collision against other objects
        for (let actor of this.actors) {
            if (boxOverlap(this.player.collider, actor.collider)) {
                actor.color = "yellow";
            } else {
                actor.color = "grey";
            }
        }
    }

    addBox() {
        // Create boxes with minimum size 50, and up to 50 pixels more
        const size = randomRange(50, 50);
        const posX = randomRange(canvasWidth - size);
        const posY = randomRange(canvasHeight - size);
        const box = new GameObject(new Vector(posX, posY), size, size, "grey");
        box.destroy = false;
        this.actors.push(box);
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'w') {
                this.addKey('up');
            } else if (event.key == 'a') {
                this.addKey('left');
            } else if (event.key == 's') {
                this.addKey('down');
            } else if (event.key == 'd') {
                this.addKey('right');
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.delKey('up');
            } else if (event.key == 'a') {
                this.delKey('left');
            } else if (event.key == 's') {
                this.delKey('down');
            } else if (event.key == 'd') {
                this.delKey('right');
            }
        });
    }

    addKey(direction) {
        if (!this.player.keys.includes(direction)) {
            this.player.keys.push(direction);
        }
    }

    delKey(direction) {
        if (this.player.keys.includes(direction)) {
            this.player.keys.splice(this.player.keys.indexOf(direction), 1);
        }
    }
}


// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}


// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

main();
