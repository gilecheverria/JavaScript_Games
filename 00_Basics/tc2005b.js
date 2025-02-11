/*
 * Practice functions for Javascript
 *
 * Gilberto Echeverria
 * 2025-02-10
 */

export function firstNonRepeating(string) {
    for (let i=0; i<string.length; i++) {
        let repeated = false;
        for (let j=0; j<string.length; j++) {
            //console.log(`Comparing ${string[i]} with ${string[j]}`)
            if (string[i] === string[j] && i != j) {
                repeated = true;
                break;
            }
        }
        if (!repeated) {
            return string[i];
        }
    }
    return undefined;
}

export function bubbleSort(data) {
    for (let i=0; i<data.length; i++) {
        for (let j=i+1; j<data.length; j++) {
            if (data[j] < data[i]) {
                let temp = data[j];
                data[j] = data[i];
                data[i] = temp;
            }
        }
    }
    return data;
}

export function invertArray(data) {
    const result = [];
    for (let item of data) {
        result.unshift(item);
    }
    return result;
}

export function invertArrayInplace(data) {
    for (let i=0; i<data.length/2; i++) {
        let temp = data[data.length - 1 - i];
        data[data.length - 1 - i] = data[i];
        data[i] = temp;
    }
}

export function capitalize(string) {
    if (string.length == 0) {
        return "";
    }
    let result = string[0].toUpperCase();
    for (let i=1; i<string.length; i++) {
        if (string[i - 1] == " ") {
            result += string[i].toUpperCase();
        } else {
            result += string[i];
        }
    }
    return result;
}

export function mcd(num1, num2) {
    let divisor = 1;
    let test = 1;
    if (num1 === 0 || num2 === 0) {
        return 0;
    }
    while (test <= num1 && test <= num2) {
        if (num1 % test == 0 && num2 % test == 0) {
            divisor = test;
        }
        test++;
    }
    return divisor;
}

export function hackerSpeak(string) {
    const changes = {
        "a": "4",
        "e": "3",
        "i": "1",
        "o": "0",
        "s": "5"
    };

    let result = "";
    for (let char of string) {
        if (char in changes) {
            result += changes[char];
        } else {
            result += char;
        }
    }
    return result;
}

export function factorize(num) {
    const result = [];
    for (let d=1; d<=num; d++) {
        if (num % d == 0) {
            result.push(d);
        }
    }
    return result;
}

export function deduplicate(data) {
    const result = [];
    for (let item of data) {
        if (!result.includes(item)) {
            result.push(item);
        }
    }
    return result;
}

export function findShortestString(strings) {
    if (strings.length == 0) {
        return 0;
    }

    let min = strings[0].length;
    for (let string of strings) {
        if (string.length < min) {
            min = string.length;
        }
    }
    return min;
}

export function isPalindrome(string) {
    const limit = Math.floor(string.size / 2);
    for (let i=0; i<limit; i++) {
        if (string[i] !== string.at(-(i + 1))) {
            return false;
        }
    }
    return true;
}

export function sortStrings(strings) {
    return bubbleSort(strings);
}

export function stats(data) {
    if (data.length == 0) {
        return [0, 0];
    }

    const counts = {};
    let total = 0;
    let maxCount = 0;
    let mode = 0;
    for (let item of data) {
        total += item;
        if (item in counts) {
            counts[item] += 1;
        } else {
            counts[item] = 1;
        }
        if (counts[item] > maxCount) {
            maxCount = counts[item];
            mode = item;
        }
    }

    return [total / data.length, Number(mode)];
}

export function popularString(strings) {
    const counts = {};
    let popular = "";
    let maxCount = 0;
    for (let string of strings) {
        if (string in counts) {
            counts[string] += 1;
        } else {
            counts[string] = 1;
        }
        if (counts[string] > maxCount) {
            maxCount = counts[string];
            popular = string;
        }
    }

    return popular;
}

export function isPowerOf2(num) {
    let power = 0;
    while (2 ** power < num) {
        power++;
    }
    return 2 ** power === num;
}

export function sortDescending(data) {
    const result = [];
    for (let i=0; i<data.length; i++) {
        let maxValue = Number.MIN_VALUE;
        let maxIndex = 0;
        for (let j=i; j<data.length; j++) {
            if (data[j] > maxValue) {
                maxValue = data[j];
                maxIndex = j;
            }
        }
        // Swap the position in the original array
        let temp = data[i];
        data[i] = data[maxIndex];
        data[maxIndex] = temp;
        result.push(maxValue);
    }
    return result;
}
