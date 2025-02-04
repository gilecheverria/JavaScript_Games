/*
 * Intermediate set of functions to start learning a language
 * Based on the exercises proposed by Ariel Ortiz
 *
 * Gilberto Echeverria
 * 2025-01-20
 */

"use strict";

export function insert(list, newItem) {
    if (list.length === 0) {
        return [newItem];
    }
    const result = [];
    let position = 0;
    for (const item of list) {
        if (newItem > item) {
            result.push(item);
            position++;
        }
    }
    result.push(newItem);
    return result.concat(list.slice(position));
}

export function insertionSort(list) {
    let result = [];
    for (const item of list) {
        result = insert(result, item);
    }
    return result;
}

export function rotateLeft(list, positions) {
    positions = positions % list.length;
    if (positions < 0) {
        positions = list.length + positions;
    }

    // Make a copy of the original list
    //let result = list.map((item) => item);
    let result = list.slice();
    for (let i=0; i<positions; i++) {
        const item = result.shift();
        result.push(item);
    }
    return result;
}

export function primeFactors(number) {
    const result = [];
    let factor = 2;
    while (number > 1) {
        if (number % factor == 0) {
            result.push(factor);
            number = Math.floor(number / factor);
        } else {
            factor++;
        }
    }
    return result;
}

export function gcd(a, b) {
    let temp;
    while (b !== 0) {
        temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

export function deepReverse(data) {
    if (Array.isArray(data)) {
        const result = [];
        for (const item of data) {
            result.unshift(deepReverse(item));
        }
        return result;
    } else {
        return data;
    }
}

export function insertAt(data, position, item) {
    if (data == []) {
        return [item];
    }
    // Adjust the position to always be positive
    const len = data.length;
    if (position < 0) {
        position = len + 1 + position;
    }
    // Advance until the required position
    const result = [];
    // Copy the original Array
    const temp = data.slice();
    for (let i=0; i<position && i<len; i++) {
        result.push(temp.shift());
    }
    result.push(item);
    return result.concat(temp);
}

export function insertEverywhere(data, item) {
    const result = [];
    const len = data.length;
    for (let i=0; i<=len; i++) {
        result.push(insertAt(data, i, item));
    }
    return result;
}

export function pack(data) {
    const len = data.length;
    const result = [];
    for (let i=0; i<len; i++) {
        if (i === 0) {
            result.push([data[0]]);
        } else if (data[i] === result.at(-1)[0]) {
            // The item is equal to the previous one
            result.at(-1).push(data[i]);
        } else {
            // The item is different
            result.push([data[i]]);
        }
    }
    return result;
}

export function compress(data) {
    const result = [];
    for (const item of data) {
        if (item !== result.at(-1)) {
            result.push(item);
        }
    }
    return result;
}

export function encode(data) {
    const len = data.length;
    const result = [];
    for (let i=0; i<len; i++) {
        if (i === 0) {
            result.push([1, data[0]]);
        } else if (data[i] === result.at(-1)[1]) {
            // The item is equal to the previous one
            result.at(-1)[0] += 1;
        } else {
            // The item is different
            result.push([1, data[i]]);
        }
    }
    return result;
}

export function encodeModified(data) {
    const len = data.length;
    const result = [];
    for (let i=0; i<len; i++) {
        if (i === 0) {
            result.push(data[0]);
        } else if (data[i] === result.at(-1)) {
            // The item is equal to the previous one not inside a list
            result[result.length - 1] = [2, data[i]];
            //result.at(-1) = [2, data[i]];     // This is not allowed
        } else if (data[i] === result.at(-1)[1]) {
            // The item is equal to the previous one already in a list
            result.at(-1)[0] += 1;
        } else {
            // The item is different
            result.push(data[i]);
        }
    }
    return result;
}

export function decode(data) {
    const result = [];
    for (const item of data) {
        if (Array.isArray(item)) {
            for (let i=0; i<item[0]; i++) {
                result.push(item[1]);
            }
        } else {
            result.push(item);
        }
    }
    return result;
}

export function argsSwap(func) {
    //return (a, b) => { return func(b, a); };
    return (a, b) => func(b, a);
}

export function thereExistsOne(func, data) {
    let count = 0;
    for (const item of data) {
        if (func(item)) {
            count++;
        }
    }
    return count === 1;
}

export function linearSearch(data, item, func) {
    let index = 0;
    for (index=0; index<data.length; index++) {
        if (func(data[index], item)) {
            return index;
        }
    }
    return false;
}

/*
 * Receive a function f and an approximation value
 * Return a new function that evaluates the derivative of f
 */
export function deriv(f, h) {
    return function(x) {
        return (f(x  + h) - f(x)) / h;
    };
}

/*
 * Receive a function and a number of iterations
 * Return an approximation of the root of the function after n iterations
 */
export function newton(f, n) {
    const df = deriv(f, 0.0001);
    let solution = 0;
    for (let i=0; i<n; i++) {
        solution -= f(solution) / df(solution);
    }
    return solution;
}

export function integral(a, b, n, f) {
    const h = (b - a) / n;
    // Initialize with yn
    let sum = f(a + n * h);
    let multiplier = 1;
    for (let k=n-1; k>0; k--) {
        if (k % 2 == 0) {
            multiplier = 2;
        } else {
            multiplier = 4;
        }
        sum += multiplier * f(a + k * h);
    }
    // Finish by adding y0
    sum += f(a);
    return h / 3 * sum;
}
