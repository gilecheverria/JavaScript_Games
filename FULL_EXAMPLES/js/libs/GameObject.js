/*
 * Class for the base Game Object used for all the actors in a scene.
 *
 * The position of the object is its center.
 *
 * Gilberto Echeverria
 * 2026-02-15
 */

"use strict";

import { Vector } from "./Vector.js";
import { Rect } from "./Rect.js";

// Global variables to select whether to display bounding boxes and colliders
let showBBox = false;
let showColl = false;

// Register event listeners to toggle bounding boxes
window.addEventListener('keydown', event => {
    if (event.key == 'y') showBBox = !showBBox;
    if (event.key == 'u') showColl = !showColl;
});



export class GameObject {
    // Using object destructuring to make parameters more readable and easier to use
    constructor( { position, width, height, color, type, scale=1.0 } ) {
        this.position = position;
        this.size = new Vector(width, height);
        this.halfSize = new Vector(width / 2, height / 2);
        this.color = color;
        this.type = type;
        // Default scale for all new objects
        this.scale = scale;

        // Sprite properties
        this.spriteImage = undefined;
        this.spriteRect = undefined;
        // Rotation of the object depending on the sprite used
        this.spriteRotation = 0;  // radians (0 = no rotation)

        // Intialize a collider with the default object size
        this.setCollider(width, height);

        /*
        if (this.type == "player") {
            console.log("Player created:");
            console.log(this);
        }
        */
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    setCollider(width, height) {
        // The top left corner of the collider is offset by half of its size
        this.xOffset = width / 2;
        this.yOffset = height / 2;
        this.colliderWidth = width;
        this.colliderHeight = height;
        this.updateCollider();
    }

    updateCollider() {
        // Adjust the Rect of the object with its position
        this.collider = new Rect(this.position.x - this.xOffset * this.scale,
                                 this.position.y - this.yOffset * this.scale,
                                 this.colliderWidth * this.scale,
                                 this.colliderHeight * this.scale);
    }

    draw(ctx) {
        // Define variables for the dimensions of the object on screen
        const w = this.size.x * this.scale;
        const h = this.size.y * this.scale;
        const cx = this.position.x;
        const cy = this.position.y;
        const rot = this.spriteRotation !== 0;

        // Rotate the shape drawn, if the object is rotated
        if (rot) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(this.spriteRotation);
            ctx.translate(-w / 2, -h / 2);
        }

        if (this.spriteImage) {
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.x,
                              this.spriteRect.y,
                              this.spriteRect.width,
                              this.spriteRect.height,
                              rot ? 0 : (cx - w / 2),
                              rot ? 0 : (cy - h / 2),
                              w, h);
            } else {
                ctx.drawImage(this.spriteImage,
                              rot ? 0 : (cx - w / 2),
                              rot ? 0 : (cy - h / 2),
                              w, h);
            }
            // Add an overlay of color (mixing the color of the sprite and the color)
            if (this.color) {
                ctx.save();
                ctx.globalAlpha = 0.35;
                ctx.fillStyle = this.color;
                ctx.fillRect(rot ? 0 : (cx - w / 2), rot ? 0 : (cy - h / 2), w, h);
                ctx.restore();
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(rot ? 0 : (cx - w / 2), rot ? 0 : (cy - h / 2), w, h);
        }

        if (rot) {
            ctx.restore();
        }

        if (showBBox) this.drawBoundingBox(ctx);
        if (showColl) this.drawCollider(ctx);
    }

    drawBoundingBox(ctx) {
        // Define variables for the dimensions of the object on screen
        const w = this.size.x * this.scale;
        const h = this.size.y * this.scale;
        const cx = this.position.x;
        const cy = this.position.y;
        const rot = this.spriteRotation !== 0;

        if (rot) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(this.spriteRotation);
            ctx.translate(-w / 2, -h / 2);
        }

        // Attempt to compose the overlay so it makes the image lighter
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgb(0.5, 0.5, 0.5, 0.3)";
        ctx.fillRect(rot ? 0 : (cx - w / 2), rot ? 0 : (cy - h / 2), w, h);
        ctx.globalCompositeOperation = "source-over";

        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(rot ? 0 : (cx - w / 2), rot ? 0 : (cy - h / 2), w, h);
        ctx.stroke();

        ctx.fillStyle = "red";
        ctx.fillRect(rot ? (w / 2 - 2) : (cx - 2), rot ? (h / 2 - 2) : (cy - 2), 4, 4);

        if (rot) ctx.restore();
    }

    drawCollider(ctx) {
        const rot = this.spriteRotation !== 0;

        if (rot) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.spriteRotation);
            ctx.translate(this.collider.x - this.position.x, this.collider.y - this.position.y);
        }

        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.rect(rot ? 0 : this.collider.x,
                 rot ? 0 : this.collider.y,
                 this.collider.width,
                 this.collider.height);
        ctx.stroke();

        if (rot) ctx.restore();
    }

    // Empty template for all GameObjects to be able to update
    update() {

    }
}
