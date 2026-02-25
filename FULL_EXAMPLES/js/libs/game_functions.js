/*
 * Collection of functions that will be used in the games
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";

/*
 * Detect a collision of two box colliders
 *
 * Arguments:
 * - obj1: An instance of the Rect class with properties x, y, width, height
 * - obj2: An instance of the Rect class with properties x, y, width, height
 *
 * Returns:
 * - true if the boxes overlap, false otherwise
 */
function boxOverlap(obj1, obj2) {
    // Declare legible names for the borders
    const obj1left = obj1.x;
    const obj1right = obj1.x + obj1.width;
    const obj1top = obj1.y;
    const obj1bottom = obj1.y + obj1.height;

    const obj2left = obj2.x;
    const obj2right = obj2.x + obj2.width;
    const obj2top = obj2.y;
    const obj2bottom = obj2.y + obj2.height;

    // Compare the values to determine if the boxes overlap
    return obj1right > obj2left &&
           obj1left < obj2right &&
           obj1bottom > obj2top &&
           obj1top < obj2bottom;

    //return obj1.x + obj1.width > obj2.x &&
    //       obj1.x < obj2.x + obj2.width &&
    //       obj1.y + obj1.height > obj2.y &&
    //       obj1.y < obj2.y + obj2.height;
}

/*
 * Generate a random integer in the range [start, start + size - 1]
 *
 * Arguments:
 * - size: The size of the range (number of possible values)
 * - start: The starting value of the range (default is 0)
 *
 * Returns:
 * - A random integer in the specified range
*/
function randomRange(size, start) {
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}

export { boxOverlap, randomRange };
