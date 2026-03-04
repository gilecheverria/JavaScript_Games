/*
 * Class for the principal game object in a simple game
 *
 * Gilberto Echeverria
 * 2026-02-16
 */

import { Vector } from "./Vector.js";
import { GameObject } from "./GameObject.js";

export class Player extends GameObject {
    // Using object destructuring to make parameters more readable and easier to use
    constructor( { position, width, height, color } ) {
        super( { position: position,
            width: width,
            height: height,
            color: color,
            type: "player"
        } );
        this.velocity = new Vector(0, 0);
        // Default value for player speed
        this.speed = 1.0;

        // Keys pressed to move the player
        this.keys = [];

        // Data structure with the directions a character can move and the
        // direction sign.
        this.motion = {
            up: {
                axis: "y",
                sign: -1,
            },
            left: {
                axis: "x",
                sign: -1,
            },
            down: {
                axis: "y",
                sign: 1,
            },
            right: {
                axis: "x",
                sign: 1,
            },
        }
    }

    update(deltaTime, canvas) {
        // Restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }
        // Normalize the velocity to avoid greater speed on diagonals
        this.velocity = this.velocity.normalize().times(this.speed);
        this.position = this.position.plus(this.velocity.times(deltaTime));

        // Restrict the player to move only within the canvas area
        this.clampWithinCanvas(canvas);

        // Change the collider's position
        this.updateCollider();
    }

    clampWithinCanvas(canvas) {
        // Top border
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y;
        // Left border
        }
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
        // Bottom border
        }
        if (this.position.y + this.halfSize.y > canvas.height) {
            this.position.y = canvas.height - this.halfSize.y;
        // Right border
        }
        if (this.position.x + this.halfSize.x > canvas.width) {
            this.position.x = canvas.width - this.halfSize.x;
        }
    }

    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }
}
