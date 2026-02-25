/*
 * Class for a game object that has animation using a spritesheet
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";

import { GameObject } from "./GameObject";


// Class to control the animation of characters and objects
export class AnimatedObject extends GameObject {
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type);
        // Animation properties
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = sheetCols;

        this.repeat = true;

        // Delay between frames (in milliseconds)
        this.frameDuration = 100;
        this.totalTime = 0;
    }

    /*
     * Method to set the range of animation frames to use for the current animation,
     * and whether to repeat the animation
     *
     * Arguments:
     * - minFrame: The index of the first frame in the animation sequence
     * - maxFrame: The index of the last frame in the animation sequence
     * - repeat: Whether to loop the animation (default is true)
     * - duration: The delay between frames in milliseconds (default is 100)
     */
    setAnimation(minFrame, maxFrame, repeat, duration) {
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
        //console.log(`Animation: ${minFrame} - ${maxFrame}`);
    }

    /*
     * Change the frame number to the next one.
     * Loop back to the first frame if the animation is set to repeat.
     * Also set the rectangle to be drawn from the spritesheet according to the current frame.
     *
     * Arguments:
     *   deltaTime: Time elapsed since the last frame (in milliseconds)
     */
    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameDuration) {
            // Loop around the animation frames if the animation is set to repeat
            // Otherwise stay on the last frame
            let restartFrame = (this.repeat ? this.minFrame : this.maxFrame);
            //console.log(`Frame: ${this.frame}, Max: ${this.maxFrame}, Restart: ${restartFrame}, Repeat: ${this.repeat}`);
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : restartFrame;
            this.spriteRect.x = this.frame % this.sheetCols * this.spriteRect.width;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols) * this.spriteRect.height;
            this.totalTime = 0;
        }
    }
}
