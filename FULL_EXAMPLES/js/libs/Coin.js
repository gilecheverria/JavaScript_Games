/*
 * Coin class, inherits from AnimatedObject
 *
 * Gilberto Echeverria
 * 2026-02-25
 */

"use strict";

import { AnimatedObject } from "./AnimatedObject.js";

export class Coin extends AnimatedObject {
    constructor( { position, width, height, _color, _type } ) {
        super( {
            position: position,
            width: width,
            height: height,
            color: "yellow",
            type: "coin"
        } );
    }

    update(_level, deltaTime) {
        this.updateFrame(deltaTime);
    }
}
