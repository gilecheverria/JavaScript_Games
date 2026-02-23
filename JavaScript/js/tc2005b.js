/*
 * Example functions to practice JavaScript
 *
 * Gilberto Echeverria
 * 2025-02-12
 */

"use strict";


/*
 * Find the first character inside a string that appears only once
 * Solution using a list of objects with the counters for each letter
 *
 * Arguments:
 *  str: the string to search
 * Returns:
 *  The first non-repeating character in the string, or undefined if there is none
 */
export function firstNonRepeating(str) {
    // Create an empty array to store the candidates
    const candidates = [];
    // Check every character in the string
    for (let i=0; i<str.length; i++) {
        // Compare against the candidates
        let found = false;
        for (let cand of candidates) {
            // If the char had already been found, increase its counter
            if (cand.char == str[i]) {
                cand.count += 1;
                found = true;
            }
        }
        // If the char was not found, add it to the list
        if (!found) {
            candidates.push({char: str[i], count: 1});
        }
    }

    // Show the data structure generated
    // A list of objects
    //console.log(candidates);

    // Look for the first char that appeared only once
    for (let index in candidates) {
        if (candidates[index].count == 1) {
            return candidates[index].char;
        }
    }
}

/*
 * Find the first character inside a string that appears only once
 * Solution using a list of objects with the counters for each letter
 *
 * Arguments:
 *  str: the string to search
 * Returns:
 *  The first non-repeating character in the string, or undefined if there is none
// Solution using nested for loops
export function firstNonRepeating(string) {
    for (let i=0; i<string.length; i++) {
        let repeated = false;
        for (let j=0; j<string.length; j++) {
            if (string[i] == string[j] && i != j) {
                repeated = true;
                break;
            }
        }
        //console.log(`Char: ${string[i]}, repeated: ${repeated}`);
        if (!repeated) {
            return string[i];
        }
    }
}
*/

export function bubbleSort(data) {
    for (let i=0; i<data.length; i++) {
        for (let j=i; j<data.length; j++) {
            if (data[j] < data[i]) {
                let temp = data[i];
                data[i] = data[j];
                data[j] = temp;
            }
        }
    }
    return data;
}

export function invertArray(data) {
    const newData = [];
    for (let item of data) {
        newData.unshift(item);
    }
    return newData;
}

export function invertArrayInplace(data) {
    for (let i=0; i<data.length/2; i++) {
        let temp = data[i];
        data[i] = data[data.length - i - 1];
        data[data.length -i - 1] = temp;
    }
    return data;
}

/*
 * Capitalize the first letter of each word in a toString
 * Example: "this is a test" -> "This Is A Test"
 *
 * Arguments:
 *  str: the string to capitalize
 *
 * Returns:
 *  A new string with the first letter of each word capitalized
 */
export function capitalize(str) {
    if (str.length == 0) {
        return str;
    }
    let newStr = "";
    let parts = str.split(" ");
    for (let part of parts) {
        newStr += part[0].toUpperCase() + part.slice(1) + " ";
    }
    return newStr.trim();
}

/*
 * Function to find the minimum common divisor MCD of two numbers
 *
 * Arguments:
 *  a: the first number
 *  b: the second number
 *
 * Returns:
 *  The MCD of a and b
 */
export function mcd(a, b) {
    if (b == 0) {
        return a;
    }
    return mcd(b, a % b);
}

export function stats(data) {
    return [mean(data), mode(data)];
}

function mean(data) {
    let total = 0;
    for (let item of data) {
        total += item;
    }
    return total / data.length;
}

function mode(data) {
    const counters = {};
    for (let item of data) {
        if (item in counters) {
            counters[item] += 1;
        } else {
            counters[item] = 1;
        }
    }
    let max = 0;
    let cand = undefined;
    for (let [number, count] of Object.entries(counters)) {
        if (count > max) {
            max = count;
            cand = number;
        }
    }
    // Convert the key (string) into an integer
    return +cand;
}


/*
console.log( firstNonRepeating("This is a test") );
console.log( firstNonRepeating("abacddbec") );
*/
