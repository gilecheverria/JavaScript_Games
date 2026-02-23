/*
 * Simple bullet hell game
 * Reference for mouse events:
 * https://javascript.info/mouse-events-basics
 *
 * Gilberto Echeverria
 * 2025-04-24
 */

"use strict";

import { Vector } from "./libs/Vector";
import { Rect } from "./libs/Rect";
import { GameObject } from "./libs/GameObject";
import { Player } from "./libs/Player";
import { Bullet } from "./libs/Bullet";
import { boxOverlap, randomRange } from "./libs/game_functions";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;
let canvas;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime;

let playerSpeed = 0.2;
let bulletSpeed = 0.05;
let bulletDelay = 80;
let bulletAngleIncrement = Math.PI / 25.5;

let scale = 1.5;

// Dictionary for the keys that will control player movement
const keyDirections = {
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
};



// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();

        this.nextActorTime = randomRange(500, 1000);
        this.generateTime = 0;

        this.bulletDelay = bulletDelay;
        this.bulletTimer = 0;
        this.bulletAngle = 0;
        this.bulletAngleIncrement = bulletAngleIncrement;
    }

    initObjects() {
        this.player = new Player(new Vector(canvasWidth / 2, canvasHeight / 4 * 3), 40, 40, "yellow");
        this.player.setSprite("../assets/sprites/nightraidervertical.png");
        this.player.setCollider(20, 30);
        this.player.setSpeed(playerSpeed );
        this.player.setScale(scale);

        this.actors = [];
        this.playerBullets = [];
        this.enemyBullets = [];
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        for (let bullet of this.enemyBullets) {
            bullet.draw(ctx);
        }
        for (let bullet of this.playerBullets) {
            bullet.draw(ctx);
        }
        this.player.draw(ctx);
    }

    update(deltaTime) {
        // Delete the destroyed actors
        this.actors = this.actors.filter(actor => !actor.destroy);

        // Delete the destroyed bullets
        this.playerBullets = this.playerBullets.filter(bullet => !bullet.destroy);
        this.enemyBullets = this.enemyBullets.filter(bullet => !bullet.destroy);
        // Move the bullets
        for (let bullet of this.playerBullets) {
            bullet.update(deltaTime, ctx.canvas);
        }
        for (let bullet of this.enemyBullets) {
            bullet.update(deltaTime, ctx.canvas);
        }
        // Move the player
        this.player.update(deltaTime, ctx.canvas);

        this.checkCollisions();

        //this.generateBoxes(deltaTime);
        this.generateBullets(deltaTime);
    }

    generateBoxes(deltaTime) {
        this.generateTime += deltaTime;
        // Generate new boxes at random intervals
        if (this.generateTime > this.nextActorTime) {
            this.addBox();
            this.nextActorTime = randomRange(500, 1000);
            this.generateTime = 0;
        }
    }

    generateBullets(deltaTime) {
        this.bulletTimer += deltaTime;
        // Generate new boxes at random intervals
        if (this.bulletTimer > this.bulletDelay) {
            this.bulletAngle += this.bulletAngleIncrement;
            this.bulletTimer = 0;
            let originX = canvasWidth / 2;
            let originY = 100;

            let destX = Math.cos(this.bulletAngle);
            let destY = Math.sin(this.bulletAngle);
            this.addEnemyBullet(originX, originY, destX, destY);

            destX = Math.cos(this.bulletAngle + Math.PI);
            destY = Math.sin(this.bulletAngle + Math.PI);
            this.addEnemyBullet(originX, originY, destX, destY);
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

    checkCollisions() {
        // Check collision against other objects
        for (let actor of this.actors) {
            // With the player
            if (boxOverlap(this.player.collider, actor.collider)) {
                actor.color = "yellow";
            } else {
                actor.color = "grey";
            }
        }

        // Enemy bullets with the player
        for (let bullet of this.enemyBullets) {
            if (boxOverlap(bullet.collider, this.player.collider)) {
                bullet.destroy = true;
                this.player.destroy = true;
            }
        }
    }

    createEventListeners() {
        window.addEventListener('keydown', event => {
            // Detect the predefined keys for movement and store the direction
            if (event.key in keyDirections) {
                this.addKey(keyDirections[event.key]);
            }
        });

        window.addEventListener('keyup', event => {
            // Detect the predefined keys for movement and remove the direction
            if (event.key in keyDirections) {
                this.delKey(keyDirections[event.key]);
            }
        });

        canvas.addEventListener('click', event => {
            if (event.button == 0) {
                // Identify the location of the canvas within the window
                const rect = canvas.getBoundingClientRect();
                // Get the coordinates where the mouse was in the window
                // Adjust those coordinates to the area of the canvas
                const canX = event.clientX - rect.left;
                const canY = event.clientY - rect.top;

                // Create a new bullet
                this.addBullet(canX, canY);
            }

        });
    }

    // Add directions to the keys array for character movement
    addKey(direction) {
        if (!this.player.keys.includes(direction)) {
            this.player.keys.push(direction);
        }
    }

    // Remove directions from the keys array for character movement
    delKey(direction) {
        if (this.player.keys.includes(direction)) {
            this.player.keys.splice(this.player.keys.indexOf(direction), 1);
        }
    }

    // Instantiate a new bullet
    addBullet(clickX, clickY) {
        const bullet = new Bullet(game.player.position, 6, 20, "purple", bulletSpeed * 4);
        bullet.setSprite("../assets/sprites/beams.png",
                         new Rect(231, 221, 40, 66)); // Purple beams
        bullet.setCollider(6, 6);
        // Compute the direction for the bullet movement,
        // based on the position of the mouse
        const moveVector = new Vector(clickX, clickY).minus(bullet.position).normalize();
        bullet.setVelocity(moveVector.x, moveVector.y);
        bullet.setSpriteRotation(Math.PI / 2);
        bullet.setScale(scale);
        game.playerBullets.push(bullet);
    }

    addEnemyBullet(originX, originY, destX, destY) {
        const bullet = new Bullet(new Vector(originX, originY), 6, 12, "blue", bulletSpeed);
        bullet.setSprite("../assets/sprites/beams.png",
                         new Rect(238, 96, 44, 92)); // Blue beams
        bullet.setCollider(6, 6);
        bullet.setVelocity(destX, destY);
        bullet.setSpriteRotation(Math.PI / 2);
        bullet.setScale(scale);
        game.enemyBullets.push(bullet);
    }
}


// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    canvas = document.getElementById('canvas');
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

    // Slow down time
    //deltaTime *= 0.5;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // fill the entire canvas with black before drawing the circles
    ctx.fillStyle = "rgb(80, 40, 100)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    game.update(deltaTime);

    game.draw(ctx, scale);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}


main();
