/*
 * Functions to test how arrays behave in JavaScript
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";

function addItemsFor(array) {
    let result = 0;
    for (let i=0; i<array.length; i++) {
        result += array[i];
    }
    return result;
}

function addItemsForIn(array) {
    let result = 0;
    for (let index in array) {
        result += array[index];
    }
    return result;
}

function addItemsForOf(array) {
    let result = 0;
    for (let item of array) {
        result += item;
    }
    return result;
}

function addItemsReduce(array) {
    let result = array.reduce((acc, item) => acc + item, 0);
    return result;
}

export { addItemsFor, addItemsForIn, addItemsForOf, addItemsReduce };
