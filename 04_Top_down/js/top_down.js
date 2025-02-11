/*
 * Simple top down adventure game
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

let game;
let player;
let level;

let playerSpeed = 0.3;

// Scale of the whole world, to be applied to all objects
const scale = 20;

class Player extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super("green", width, height, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);
        this.money = 0;
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

class Coin extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super("yellow", width, height, x, y, "coin");
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
        this.actors = [];
        this.player = undefined;
    }

    generateLevel(plan) {
        let rows = plan.trim().split('\n').map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;

        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let type = levelChars[ch];
                if (typeof type !== "string") {
                    //let pos = new Vec(x, y);
                    let actor = new type("grey", scale, scale, x * scale, y * scale, "obstacle");
                    if (actor instanceof Player) {
                        this.player = actor;
                    } else if (actor instanceof Coin) {
                        this.actors.push(actor);
                    } else {
                        this.actors.push(actor);
                    }
                    type = "empty";
                }
                return type;
            });
        });

    }

    update() {
        this.player.move();

        for (let actor of this.actors) {
            actor.move();
        }

        // Detect collisions
        for (let actor of this.actors) {
            if (overlapRectangles(this.player, actor)) {
                //console.log(`Collision of ${this.player.type} with ${actor.type}`);
                if (actor.type == 'wall') {
                    console.log("Hit a wall");
                } else if (actor.type == 'coin') {
                    this.player.money += 1;
                }
            }
        }
    }

    draw() {
        this.player.draw();
        for (let actor of this.actors) {
            actor.draw();
        }
    }
}

const levelChars = {
    ".": "empty",
    "#": Obstacle,
    "@": Player,
    "$": Coin,
};

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

    // Register the objects in the game
    game = new Game('playing');

    game.generateLevel(GAME_LEVELS[0]);

    setEventListeners();

    // Call the first frame with the current time
    updateCanvas(document.timeline.currentTime);
}

function setEventListeners() {
    window.addEventListener("keydown", event => {
        if (event.key == 'w') {
            game.player.velocity.y = -playerSpeed;
        }
        if (event.key == 'a') {
            game.player.velocity.x = -playerSpeed;
        }
        if (event.key == 's') {
            game.player.velocity.y = playerSpeed;
        }
        if (event.key == 'd') {
            game.player.velocity.x = playerSpeed;
        }
    });

    window.addEventListener("keyup", event => {
        if (event.key == 'w') {
            game.player.velocity.y = 0.0;
        }
        if (event.key == 'a') {
            game.player.velocity.x = 0.0;
        }
        if (event.key == 's') {
            game.player.velocity.y = 0.0;
        }
        if (event.key == 'd') {
            game.player.velocity.x = 0.0;
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
