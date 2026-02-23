/*
 * Collection of functions that will be used in the games
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";

// Detect a collision of two box objects
function boxOverlap(obj1, obj2) {
    return obj1.x + obj1.width > obj2.x &&
           obj1.x < obj2.x + obj2.width &&
           obj1.y + obj1.height > obj2.y &&
           obj1.y < obj2.y + obj2.height;
    //return obj1.position.x + obj1.width > obj2.position.x &&
    //       obj1.position.x < obj2.position.x + obj2.width &&
    //       obj1.position.y + obj1.height > obj2.position.y &&
    //       obj1.position.y < obj2.position.y + obj2.height;
}

function randomRange(size, start) {
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}

export { boxOverlap, randomRange };
