/*
 * Collection of functions that will be used in the games
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";

/*
 * Detect a collision between two instances of GameObject.
 * This uses the rectangle of the full objects.
 * The object position is at the center of the object.
 *
 * Arguments:
 * - obj1: An instance of the GameObject class with properties position and halfSize
 * - obj2: An instance of the GameObject class with properties position and halfSize
 *
 * Returns:
 * - true if the boxes overlap, false otherwise
 */
function objectOverlap(obj1, obj2) {
    // Declare legible names for the borders
    const L1 = obj1.position.x - obj1.halfSize.x;
    const R1 = obj1.position.x + obj1.halfSize.x;
    const T1 = obj1.position.y - obj1.halfSize.y;
    const B1 = obj1.position.y + obj1.halfSize.y;

    const L2 = obj2.position.x - obj2.halfSize.x;
    const R2 = obj2.position.x + obj2.halfSize.x;
    const T2 = obj2.position.y - obj2.halfSize.y;
    const B2 = obj2.position.y + obj2.halfSize.y;

    // Compare the values to determine if the boxes overlap
    return (L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2);
}

/*
 * Detect a collision of two box colliders
 *
 * Arguments:
 * - col1: An instance of the Rect class with properties x, y, width, height
 * - col1: An instance of the Rect class with properties x, y, width, height
 *
 * Returns:
 * - true if the boxes overlap, false otherwise
 */
function boxOverlap(col1, col2) {
    // Declare legible names for the borders
    const L1 = col1.x;
    const R1 = col1.x + col1.width;
    const T1 = col1.y;
    const B1 = col1.y + col1.height;

    const L2 = col2.x;
    const R2 = col2.x + col2.width;
    const T2 = col2.y;
    const B2 = col2.y + col2.height;

    // Compare the values to determine if the boxes overlap
    return R1 > L2 &&
           L1 < R2 &&
           B1 > T2 &&
           T1 < B2;
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

/*
 * Linear interpolation of a value given the start, end and time factor
 *
 * Arguments:
 * - startValue
 * - targetValue
 * - t
 *
 * Returns:
 * - A new interpolated value
 */
function lerpValue(startValue, targetValue, t) {
    return startValue + (targetValue - startValue) * t;
}

/*
 * Lerp a color.
 *
 * Arguments:
 * - startColor: a list of three elements, representing a color in RGB
 * - targetColor: a list of three elements, representing a color in RGB
 * - t: elapsed time
 *
 * Returns:
 * - A new list with the RGB values for a color
 */
function lerpColor(startColor, targetColor, t) {
    let newColor = [0, 0, 0];
    for (let i in startColor) {
        newColor[i] = lerpValue(startColor[i], targetColor[i], t);
    }
    return newColor;
}

export { objectOverlap, boxOverlap, randomRange, lerpValue, lerpColor };
