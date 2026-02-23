/*
 * Class for the principal game object in a simple game
 * This object will have animation for some of its actions
 *
 * Gilberto Echeverria
 * 2026-02-22
 */

import { Vector } from "./Vector.js";
import { AnimatedObject } from "./AnimatedObject.js";

export class AnimatedPlayer extends AnimatedObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);
        // Default value for player speed
        this.speed = 1.0;
        this.sheetCols = sheetCols;

        // Data structure with the directions a character can move and the
        // direction sign.
        this.motion = {
            up: {
                status: false,
                axis: "y",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [0, 2],
                idleFrames: [1, 1],
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [9, 11],
                idleFrames: [10, 10],
            },
            down: {
                status: false,
                axis: "y",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [6, 8],
                idleFrames: [7, 7],
            },
            right: {
                status: false,
                axis: "x",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [3, 5],
                idleFrames: [4, 4],
            },
        }

        // Keys pressed to move the player
        this.keys = [];
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

            // Adapt the animation according to the direction
            const dirData = this.motion[direction];
            // Make changes only if the direction is different
            if (!dirData.status) {
                dirData.status = true;
                this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
            }
        }
        // Normalize the velocity to avoid greater speed on diagonals
        this.velocity = this.velocity.normalize().times(this.speed);
        this.position = this.position.plus(this.velocity.times(deltaTime));

        // Restrict the player to move only within the canvas area
        this.clampWithinCanvas(canvas);

        // Update to show then next frame when necessary
        this.updateFrame(deltaTime);

        // Change the collider's position
        this.updateCollider();
    }

    clampWithinCanvas(canvas) {
        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y > canvas.height) {
            this.position.y = canvas.height;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x > canvas.width) {
            this.position.x = canvas.width;
        }
    }

    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }


    startMovement(direction) {
        // Check whether we are already moving in a direction
        const dirData = this.motion[direction];
        // Make changes only if the direction is different
        if (!dirData.status) {
            dirData.status = true;
            //this.velocity[dirData.axis] = dirData.sign * playerSpeed;
            this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
        }
    }

    stopMovement(direction) {
        const dirData = this.motion[direction];
        dirData.status = false;
        //this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }


}
