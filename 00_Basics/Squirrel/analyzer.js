/*
 * Program to evaluate which activities cause transformation into a Squirrel
 * From the book: https://eloquentjavascript.net/04_data.html
 *
 * Gilberto Echeverria
 * 2025-01-24
 */

import { JOURNAL } from './journal.js';

/*
 * Extract the value of \phi for a combination of positive and negative events
 * Using a binary encoding for the positions of the elements in the table
 *
 * $\phi = \dfrac{n_{11} n_{00} - n_{10} n_{01}}{\sqrt{n_{1 \cdot} n_{0 \cdot} n_{\cdot 1} n_{\dcot 0}}}$
 */
// Using DESTRUCTURING (pattern matching)
function phi([n00, n01, n10, n11]) {
    return (n11 * n00 - n10 * n01) /
           Math.sqrt((n10 + n11) *
                     (n00 + n01) *
                     (n01 + n11) *
                     (n00 + n10));
}
/*
function phi(table) {
    return (table[3] * table[0] - table[2] * table[1]) /
           Math.sqrt((table[2] + table[3]) *
                     (table[0] + table[1]) *
                     (table[1] + table[3]) *
                     (table[0] + table[2]));
}
*/

/*
 * Generate the table used to compute the phi coefficient
 * Using a binary encoding for the positions of the elements in the table
 */
function tableFor(event, journal) {
    let table = [0, 0, 0, 0];
    for (let i=0; i<journal.length; i++) {
        let entry = journal[i];
        let index = 0;
        if (entry.events.includes(event)) index += 1;
        if (entry.squirrel) index += 2;
        table[index] += 1;
    }
    return table;
}

/*
console.log(tableFor("pizza", JOURNAL));

for (let entry of JOURNAL) {
    console.log(`Events: ${entry.events.length}`);
}

let avg = JOURNAL.reduce((accum, entry) => accum + entry.events.length, 0) / JOURNAL.length;
console.log(`Average events: ${avg}`);
*/

function journalEvents(journal) {
    let events = [];
    for (let entry of journal) {
        for (let event of entry.events) {
            if (!events.includes(event)) {
                events.push(event);
            }
        }
    }
    return events;
}

let events = journalEvents(JOURNAL);
/*
console.log(`Total events: ${events.length}`)
console.log(events);
*/

for (let event of events) {
    let table = tableFor(event, JOURNAL);
    let correlation = phi(table);
    if (correlation < -0.1 || correlation > 0.1) {
        console.log(`${event}: ${correlation}`);
    }
}

// Add a new entry when two events happen
for (let entry of JOURNAL) {
    if (entry.events.includes('peanuts') &&
        !entry.events.includes('brushed teeth')) {
        entry.events.push('peanut teeth');
    }
}
console.log(phi(tableFor('peanut teeth', JOURNAL)));

