/*
 * Creating and working with higher order functions
 * Taken from: https://eloquentjavascript.net/05_higher_order.html
 *
 * Gilberto Echeverria
 * 2025-01-24
 */

import { SCRIPTS } from "./scripts.js";

function filter(array, test) {
    let result = [];
    for (let item of array) {
        if (test(item)) {
            result.push(item);
        }
    }
    return result;
}

function map(array, func) {
    let result = [];
    for (let item of array) {
        result.push(func(item));
    }
    return result;
}

let living_scripts = filter(SCRIPTS, item => item.living);
let dead_scripts = filter(SCRIPTS, item => !item.living);
console.log('Living scripts:');
console.log(map(living_scripts, item => item.name));
console.log('Dead scripts:');
console.log(map(dead_scripts, item => item.name));

function reduce(array, func, initial) {
    let result = initial;
    for (let item of array) {
        result = func(result, item);
    }
    return result;
}


// Find the number of characters used in a script
function countCharacters(script) {
    // Using destructuring to seperate the elements in the inner lists
    //                                   vv    vv
    return reduce(script.ranges, (acc, [start, end]) => acc + (end - start), 0);
}

let i = 8;
console.log(`Script ${SCRIPTS[i].name} has ${countCharacters(SCRIPTS[i])} characters`);

// Find the langauge with the most characters
let largest = reduce(SCRIPTS,
                     (top, script) => { return countCharacters(top) < countCharacters(script) ? script : top; },
                     SCRIPTS[0]);
console.log(largest);

//console.log(SCRIPTS.reduce((top, script) => { return countCharacters(top) < countCharacters(script) ? script : top; }));

// Average age of living or dead scripts

function average(array) {
    return reduce(array, (a, v) => a + v, 0) / array.length;
}

console.log(average([1, 2, 3, 4, 5, 6, 7, 8]));

console.log(`Live average year: ${Math.round(average(map(living_scripts, s => s.year)))}`);
console.log(`Dead average year: ${Math.round(average(map(dead_scripts, s => s.year)))}`);
