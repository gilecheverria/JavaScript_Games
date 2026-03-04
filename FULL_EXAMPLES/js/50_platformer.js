/*
 * Simple side view platformer
 *
 * Gilberto Echeverria
 * 2025-02-05
 */

"use strict";

import { Vector } from "./libs/Vector";
import { Rect } from "./libs/Rect";
import { GameObject } from "./libs/GameObject";
import { AnimatedObject } from "./libs/AnimatedObject";
import { TextLabel } from "./libs/TextLabel.js";
import { Coin } from "./libs/Coin";
import { GAME_LEVELS } from "./51_levels.js";
//import { Player } from "./libs/Player";
//import { Bullet } from "./libs/Bullet";
import { boxOverlap, randomRange } from "./libs/game_functions";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context for the display canvas
let ctx;

// The time at the previous frame
let oldTime;

let game;
let player;
let level;

// Scale of the whole world, to be applied to all objects
// Each unit in the level file will be drawn as these many square pixels
const scale = 29;

// The project works only with very small values for velocities and acceleration
const walkSpeed = 0.005;
const initialJumpSpeed = -0.03;
const gravity = 0.0000981;

let debugJump = false;

class Player extends AnimatedObject {
    constructor( { position, width, height, _color, _type } ) {
        super( {
            position: position,
            width: width,
            height: height,
            color: "green",
            type: "player"
        } );
        this.velocity = new Vector(0.0, 0.0);
        this.money = 0;

        this.isFacingRight = true;
        this.isJumping = false;
        this.isCrouching = false;

        // Movement variables to define directions and animations
        this.movement = {
            right:  { status: false,
                      axis: "x",
                      sign: 1,
                      repeat: true,
                      duration: 80,
                      moveFrames: [24, 31],
                      idleFrames: [0, 0] },
            left:   { status: false,
                      axis: "x",
                      sign: -1,
                      repeat: true,
                      duration: 80,
                      moveFrames: [56, 63],
                      idleFrames: [32, 32] },
            jump:   { status: false,
                      repeat: false,
                      duration: 300,
                      right: [6, 7],
                      left: [38, 39] },
            crouch: { status: false,
                      repeat: false,
                      duration: 100,
                      right: [1, 1],
                      left: [33, 33],
                      upRight: [0, 0],
                      upLeft: [32, 32] },
        };

        this.showBox = true;
    }

    update(level, deltaTime) {
        //console.log("Pos: (%5.2f, %5.2f) | Vel: (%5.2f, %5.2f) | isJumping: %d",
        //            this.position.x, this.position.y, this.velocity.x, this.velocity.y, this.isJumping);

        // Make the character fall constantly because of gravity
        this.velocity.y = this.velocity.y + gravity * deltaTime;

        let velX = this.velocity.x;
        let velY = this.velocity.y;

        // Handle X-axis movement
        let newXPosition = this.position.plus(new Vector(velX * deltaTime, 0));
        let xCollision = level.contact(newXPosition, this.size, 'wall');

        // Move if there was no collision
        if (!xCollision.happened) {
            // Scroll the whole level
            game.scroll += velX * deltaTime;
            // Move the character
            this.position = newXPosition;
        // Stop when hitting an object horizontally
        } else if (xCollision.left || xCollision.right) {
            this.velocity.x = 0;
        }

        // Handle Y-axis movement
        let newYPosition = this.position.plus(new Vector(0, velY * deltaTime));
        let yCollision = level.contact(newYPosition, this.size, 'wall');

        if (!yCollision.happened) {
            this.position = newYPosition;
        } else {
            if (yCollision.top) {
                // Player is hitting a ceiling
                this.velocity.y = 0;
                // Adjust position to be just below the ceiling
                this.position.y = Math.floor(this.position.y) + 1;
            }
            if (yCollision.bottom) {
                // Player is landing on ground
                this.land();
            }
        }

        // Change the animation frame
        this.updateFrame(deltaTime);
    }

    startMovement(direction) {
        const dirData = this.movement[direction];
        this.isFacingRight = direction == "right";
        if (!dirData.status && !this.isCrouching) {
            dirData.status = true;
            this.velocity[dirData.axis] = dirData.sign * walkSpeed;
            this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
        }
    }

    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, 100);
    }

    crouch() {
        this.isCrouching = true;
        this.velocity.x = 0;
        const crouchData = this.movement.crouch;
        if (this.isFacingRight) {
            this.setAnimation(...crouchData.right, crouchData.repeat, crouchData.duration);
        } else {
            this.setAnimation(...crouchData.left, crouchData.repeat, crouchData.duration);
        }
    }

    standUp () {
        this.isCrouching = false;
        const crouchData = this.movement.crouch;
        if (this.isFacingRight) {
            this.setAnimation(...crouchData.upRight, crouchData.repeat, crouchData.duration);
        } else {
            this.setAnimation(...crouchData.upLeft, crouchData.repeat, crouchData.duration);
        }
    }

    jump() {
        if (!this.isJumping) {
            // Give a velocity so that the player starts moving up
            this.velocity.y = initialJumpSpeed;
            this.isJumping = true;
            const jumpData = this.movement.jump;
            if (this.isFacingRight) {
                this.setAnimation(...jumpData.right, jumpData.repeat, jumpData.duration);
            } else {
                this.setAnimation(...jumpData.left, jumpData.repeat, jumpData.duration);
            }
            //debugJump = true;
        }
    }

    land() {
        // If the character is touching the ground,
        // there is no vertical velocity
        this.velocity.y = 0;
        // Force the player to move down to touch the floor
        this.position.y = Math.ceil(this.position.y);
        if (this.isJumping) {
            // Reset the jump variable
            this.isJumping = false;
            const leftData = this.movement["left"];
            const rightData = this.movement["right"];
            // Continue the running animation if the player is moving
            if (leftData.status) {
                this.setAnimation(...leftData.moveFrames, leftData.repeat, leftData.duration);
            } else if (rightData.status) {
                this.setAnimation(...rightData.moveFrames, rightData.repeat, rightData.duration);
            // Otherwise switch to the idle animation
            } else {
                if (this.isFacingRight) {
                    this.setAnimation(0, 0, false, 100);
                } else {
                    this.setAnimation(32, 32, false, 100);
                }
            }
        }
    }
}

class Level {
    constructor(plan) {
        // Split the plan string into a matrix of strings
        let rows = plan.trim().split('\n').map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.actors = [];

        // Variable to randomize environments
        let rnd = Math.random();

        // Fill the rows array with a label for the type of element in the cell
        // Most cells are 'empty', except for the 'wall'
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let item = levelChars[ch];
                let objClass = item.objClass;
                let cellType = item.label;
                // Create a new instance of the type specified
                //let actor = new objClass(new Vector(x, y), 1, 1, "skyblue", item.label);
                // TODO: Fix the scale. Why is it needed to multiply the position by the scale?
                let actor = new objClass( {
                    position: new Vector(x, y),
                    width: 1,
                    height: 1,
                    color: "skyblue",
                    type: item.label,
                    scale: scale
                });
                // Configurations for each type of cell
                // TODO: Simplify this code, since most of it is repeated
                if (actor.type == "player") {
                    // Also instantiate a floor tile below the player
                    this.addBackgroundFloor(x, y);

                    // Make the player larger
                    //actor.position = actor.position.plus(new Vector(0, -3));
                    // Adjust the position of the player to be at the center,
                    // for simpler scrolling
                    actor.position = actor.position.plus(new Vector(11 * scale, -5 * scale));

                    actor.setSprite(item.sprite, item.rect);
                    actor.sheetCols = item.sheetCols;
                    actor.setAnimation(...item.startFrame, false, 100);
                    this.player = actor;
                    cellType = "empty";
                } else if (actor.type == "coin") {
                    // Also instantiate a floor tile below the player
                    this.addBackgroundFloor(x, y);

                    actor.setSprite(item.sprite, item.rect);
                    actor.sheetCols = item.sheetCols;
                    actor.setAnimation(...item.startFrame, true, 100);
                    this.actors.push(actor);
                    cellType = "empty";
                } else if (actor.type == "wall") {
                    // Randomize sprites for each wall tile
                    item.rect = this.randomEvironment(rnd);
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "wall";
                } else if (actor.type == "floor") {
                    item.rect = this.randomTile(1, 8, 4);
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "floor";
                }
                return cellType;
            });
        });
    }

    addBackgroundFloor(x, y) {
        let floor = levelChars['.'];
        // TODO: Fix the scale. Why is it needed to multiply the position by the scale?
        let floorActor = new GameObject( {
            position: new Vector(x, y),
            width: 1,
            height: 1,
            color: "skyblue",
            type: floor.label,
            scale: scale
        });
        floorActor.scale = scale;
        floor.rect = this.randomTile(1, 8, 4);
        floorActor.setSprite(floor.sprite, floor.rect);
        this.actors.push(floorActor);
    }

    // Randomize sprites for each wall tile
    randomTile(xStart, xRange, y) {
        let tile = Math.floor(Math.random() * xRange + xStart);
        // Multiply by 32 to get the position in pixels,
        // since each tile is 32x32 pixels in the sprite sheet
        return new Rect(tile * 32, y * 32, 32, 32);
    }

    randomEvironment(rnd) {
        let rect;
        if (rnd < 0.33) {
            rect = this.randomTile(1, 10, 6);    // yellow marble
        } else if (rnd < 0.66) {
            rect = this.randomTile(1, 12, 16);   // green marble with carvings
        } else {
            rect = this.randomTile(21, 12, 16);  // brown and yellow pebbles
        }
        return rect;
    }

    // Detect when the player touches a wall
    contact(playerPos, playerSize, type) {
        // Determine which cells the player is occupying
        let xStart = Math.floor(playerPos.x);
        let xEnd = Math.ceil(playerPos.x + playerSize.x);
        let yStart = Math.floor(playerPos.y);
        let yEnd = Math.ceil(playerPos.y + playerSize.y);

        // Store collision information
        let collision = {
            happened: false,
            top: false,
            right: false,
            bottom: false,
            left: false
        };

        // Check each of those cells
        for (let y=yStart; y<yEnd; y++) {
            for (let x=xStart; x<xEnd; x++) {
                // Anything outside of the bounds of the canvas is considered
                // to be a wall, so it blocks the player's movement
                let isOutside = x < 0 || x >= this.width ||
                    y < 0 || y >= this.height;
                let here = isOutside ? 'wall' : this.rows[y][x];
                // Detect if an object of type specified is being touched
                if (here == type) {
                    collision.happened = true;

                    // Determine the collision side
                    // Calculate overlap distances
                    let overlapLeft = playerPos.x + playerSize.x - x;
                    let overlapRight = x + 1 - playerPos.x;
                    let overlapTop = playerPos.y + playerSize.y - y;
                    let overlapBottom = y + 1 - playerPos.y;

                    // Find the smallest overlap - that's likely our collision side
                    let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                    if (minOverlap === overlapLeft) collision.right = true;
                    if (minOverlap === overlapRight) collision.left = true;
                    if (minOverlap === overlapTop) collision.bottom = true;
                    if (minOverlap === overlapBottom) collision.top = true;
                }
            }
        }
        return collision;
    }

}


class Game {
    constructor(state, level) {
        this.state = state;
        this.level = level;
        this.player = level.player;
        this.actors = level.actors;
        this.scroll = 0;

        this.labelMoney = new TextLabel(20, canvasHeight - 30,
                                        "30px Ubuntu Mono", "white");

        this.labelDebug = new TextLabel(canvasWidth / 2, canvasHeight - 80,
                                        "20px Ubuntu Mono", "black");

        console.log(`############ LEVEL ${level} START ###################`);
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
            if (actor.type != 'floor' && boxOverlap(this.player, actor)) {
                //console.log(`Collision of ${this.player.type} with ${actor.type}`);
                if (actor.type == 'wall') {
                    //console.log("Hit a wall");

                } else if (actor.type == 'coin') {
                    this.player.money += 1;
                    this.actors = this.actors.filter(item => item !== actor);
                }
            }
        }
    }

    draw(ctx) {
        // Save the translation of the world before drawing other objects
        ctx.save();
        ctx.translate(this.scroll * -scale, 0);

        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        this.player.draw(ctx);

        ctx.restore();

        // Draw static elements (GUI) after reseting the translation
        this.labelMoney.draw(ctx, `Money: ${this.player.money}`);

        this.labelDebug.draw(ctx, `Scroll: ${this.scroll.toFixed(3)}, Player: ${this.player.position.x.toFixed(3)}`);
        //this.labelDebug.draw(ctx, `Velocity: ( ${this.player.velocity.x.toFixed(3)}, ${this.player.velocity.y.toFixed(3)} )`);
    }
}


// Object with the characters that appear in the level description strings
// and their corresponding objects
const levelChars = {
    // Rect defined as offset from the first tile, and size of the tiles
    ".": {objClass: GameObject,
          label: "floor",
          sprite: '../assets/sprites/ProjectUtumno_full.png',
          rect: new Rect(12 * 32, 17 * 32, 32, 32)},
    "#": {objClass: GameObject,
          label: "wall",
          sprite: '../assets/sprites/ProjectUtumno_full.png',
          rect: new Rect(1 * 32, 6 * 32, 32, 32)},
    "@": {objClass: Player,
          label: "player",
          sprite: '../assets/sprites/redpants_left_right.png',
          rect: new Rect(0, 0, 46, 50),
          sheetCols: 8,
          startFrame: [0, 0]},
    "$": {objClass: Coin,
          label: "collectible",
          sprite: '../assets/sprites/coin_gold.png',
          rect: new Rect(0, 0, 32, 32),
          sheetCols: 8,
          startFrame: [0, 7]},
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
    // Register the game object, which creates all other objects
    game = new Game('playing', new Level(GAME_LEVELS[1]));

    setEventListeners();

    // Call the first frame with the current time
    updateCanvas(document.timeline.currentTime);
}

function setEventListeners() {
    window.addEventListener("keydown", event => {
        if (event.code == 'Space') {
            game.player.jump();
        }
        if (event.key == 'a') {
            game.player.startMovement("left");
        }
        if (event.key == 'd') {
            game.player.startMovement("right");
        }
        if (event.key == 's') {
            game.player.crouch();
        }
    });

    window.addEventListener("keyup", event => {
        if (event.key == 'a') {
            game.player.stopMovement("left");
        }
        if (event.key == 'd') {
            game.player.stopMovement("right");
        }
        if (event.key == 's') {
            game.player.standUp();
        }
    });
}

// Function that will be called for the game loop
function updateCanvas(newTime) {
    if (oldTime === undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;
    //console.log(`Delta Time: ${deltaTime}`);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx, scale);

    // Update time for the next frame
    oldTime = newTime;
    requestAnimationFrame(updateCanvas);
}

// Call the start function to initiate the game
main();
