/*
 * Functions to use higher order functions
 *
 * Gilberto Echeverria
 * 2025-01-27
 */

// Flattening an array:
let arrays = [[1, 2, 3], [4, 5], [6]];
const res = arrays.reduce((acc, item) => acc.concat(item), []);
console.log(res);
// → [1, 2, 3, 4, 5, 6]


// Loop function
// Receives:
// - Initial value
// - Test function
// - Update function
// - Body function
function loop(value, test, update, body) {
    if (test(value)) {
        body(value);
        loop(update(value), test, update, body);
    }
}

loop(3, n => n > 0, n => n - 1, console.log);
