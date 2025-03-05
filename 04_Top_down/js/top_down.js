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
let deltaTime;

let game;
let player;
let level;

let playerSpeed = 0.005;

// Scale of the whole world, to be applied to all objects
const scale = 22;

class Player extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super("green", width, height, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);
        this.money = 0;
    }

    update(level, deltaTime) {
        // Find out where the player should end if it moves
        let newPosition = this.position.plus(this.velocity.times(deltaTime));

        // Move only if the player does not move inside a wall
        if (! level.contact(newPosition, this.size, 'wall')) {
            this.position = newPosition;
        }
    }
}

class Coin extends AnimatedObject {
    constructor(_color, width, height, x, y, _type) {
        super("yellow", width, height, x, y, "coin");

        // Animation properties
        this.sheetCols = 8;
        this.setAnimation(0, 7);

        // Delay between frames (in milliseconds)
        this.frameTime = 100;
        this.totalTime = 0;
    }

    update(_level, deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameTime) {
            this.updateFrame();
            this.totalTime = 0;
        }
    }
}

class Obstacle extends GameObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
    }
}

class Level {
    constructor(plan) {
        let rows = plan.trim().split('\n').map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.actors = [];

        // Fill the rows array with a label for the type of element in the cell
        // Most cells are 'empty', except for the 'wall'
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let item = levelChars[ch];
                let type = item.type;
                if (typeof type !== "string") {
                    let actor = new type("grey", 1, 1, x, y, "obstacle");
                    if (actor instanceof Player) {
                        actor.setSprite(item.sprite);
                        this.player = actor;
                        type = "empty";
                    } else if (actor instanceof Coin) {
                        actor.setSprite(item.sprite, item.rect);
                        this.actors.push(actor);
                        type = "empty";
                    } else { // An obstacle
                        this.actors.push(actor);
                        actor.setSprite(item.sprite, item.rect);
                        type = "wall";
                    }
                }
                return type;
            });
        });
    }

    // Detect when the player touches a wall
    contact(playerPos, playerSize, type) {
        // Determine which cells the player is occupying
        let xStart = Math.floor(playerPos.x);
        let xEnd = Math.ceil(playerPos.x + playerSize.x);
        let yStart = Math.floor(playerPos.y);
        let yEnd = Math.ceil(playerPos.y + playerSize.y);

        // Check each of those cells
        for (let y=yStart; y<yEnd; y++) {
            for (let x=xStart; x<xEnd; x++) {
                // Anything outside of the bounds of the canvas is considered
                // to be a wall, so it blocks the player's movement
                let isOutside = x < 0 || x >= this.width ||
                                y < 0 || y >= this.height;
                let here = isOutside ? 'wall' : this.rows[y][x];
                // Detect if an object of type specified is being touched
                if (here == type) return true;
            }
        }
        return false;
    }
}

class Game {
    constructor(state, level) {
        this.state = state;
        this.level = level;
        this.player = level.player;
        this.actors = level.actors;
        //console.log(level);
        this.labelMoney = new TextLabel(20, canvasHeight - 30,
                                        "30px Ubuntu Mono", "white");
    }

    update(deltaTime) {
        this.player.update(this.level, deltaTime);

        for (let actor of this.actors) {
            actor.update(this.level, deltaTime);
        }

        // A copy of the full list to iterate over all of them
        // DOES THIS WORK?
        let currentActors = this.actors;
        // Detect collisions
        for (let actor of currentActors) {
            if (overlapRectangles(this.player, actor)) {
                //console.log(`Collision of ${this.player.type} with ${actor.type}`);
                if (actor.type == 'wall') {
                    console.log("Hit a wall");
                } else if (actor.type == 'coin') {
                    this.player.money += 1;
                    this.actors = this.actors.filter(item => item !== actor);
                }
            }
        }
    }

    draw(ctx, scale) {
        for (let actor of this.actors) {
            actor.draw(ctx, scale);
        }
        this.player.draw(ctx, scale);

        this.labelMoney.draw(ctx, `Money: ${this.player.money}`);
    }
}

const levelChars = {
    ".": {type: "empty",
          sprite: undefined},
    // Coordinates taken from the image:
    // ProjectUtumno_full.png
    "#": {type: Obstacle,
          sprite: '../assets/sprites/ProjectUtumno_full.png',
          rect: new Rect(12, 14, 32, 32)},
    "@": {type: Player,
          sprite: '../assets/sprites/link_front.png'},
    "$": {type: Coin,
          sprite: '../assets/sprites/coin_gold.png',
          rect: new Rect(0, 0, 32, 32)},
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
    game = new Game('playing', new Level(GAME_LEVELS[1]));

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
    deltaTime = frameTime - frameStart;
    //console.log(`Delta Time: ${deltaTime}`);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx, scale);

    frameStart = frameTime;
    requestAnimationFrame(updateCanvas);
}

// Call the start function to initiate the game
main();
