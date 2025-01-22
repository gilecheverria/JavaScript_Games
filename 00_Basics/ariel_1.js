/*
 * Simple set of functions to start learning a language
 * Based on the exercises proposed by Ariel Ortiz
 *
 * Gilberto Echeverria
 * 2025-01-13
 */

// Simple functions

export function fahrenheitToCelsius(temp) {
    return (temp - 32) * 5 / 9;
}

export function roots(a, b, c) {
    return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
}

// Conditionals

export function sign(number) {
    if (number == 0) {
        return 0;
    } else if (number > 0) {
        return 1;
    } else {
        return -1;
    }
}

export function bmi(weight, height) {
    let bmi = weight / (height * height);
    if (bmi < 20) {
        return "underweight";
    } else if (bmi < 25) {
        return "normal";
    } else if (bmi < 30) {
        return "obese1";
    } else if (bmi < 40) {
        return "obese2";
    } else {
        return "obese3";
    }
}

// Recursion

export function factorial(n) {
    return tailFactorial(n, 1);
}

export function tailFactorial(n, a) {
    if (n == 0) {
        return a;
    } else {
        return tailFactorial(n - 1, a * n);
    }
}

export function pow(n, p) {
    return tailPow(n, p, 1);
}

export function tailPow(n, p, a) {
    if (p == 0) {
        return a;
    } else {
        return tailPow(n, p - 1, a * n);
    }
}

/*
export function fib(n) {
    if (n < 2) {
        return n;
    } else {
        return tailFib(n - 1, 0, 1);
    }
}

function tailFib(n, a, b) {
    if (n == 0) {
        return b;
    } else {
        return tailFib(n - 1, b, a + b);
    }
}
*/

export function fib(n) {
    if (n < 2) {
        return n;
    }
    let a = 0;
    let b = 1;
    let c;
    for (let i=0; i<n-1; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return c;
}

// Lists

export function duplicate(data) {
    const result = [];
    for(const item of data) {
        result.push(item);
        result.push(item);
    };
    return result;
}

export function enlist(data) {
    const result = [];
    for(const item of data) {
        result.push([item]);
    }
    return result;
}

export function positives(data) {
    const result = [];
    for(const item of data) {
        if (item > 0) {
            result.push(item);
        }
    }
    return result;
}

export function addList(data) {
    let result = 0;
    for(const item of data) {
        result += item;
    }
    return result;
}

export function invertPairs(data) {
    const result = [];
    for(const pair of data) {
        result.push([pair[1], pair[0]]);
    }
    return result;
}

export function swapper(data, a, b) {
    const result = [];
    for(const item of data) {
        if (item === a) {
            result.push(b);
        } else if (item === b) {
            result.push(a);
        } else {
            result.push(item);
        }
    }
    return result;
}

export function dotProduct(data1, data2) {
    let result = 0;
    for(const i in data1) {
        result += data1[i] * data2[i];
    }
    return result;
}

export function average(data) {
    return (data.length === 0) ? 0 : addList(data) / data.length;
}

export function stdDev(data) {
    if (data.length === 0) {
        return 0;
    }
    const mean = average(data);
    const total = data.reduce((accum, item) => {
        return accum + (item - mean) ** 2 }, 0);
    return Math.sqrt(total / data.length);
}

export function replic(times, data) {
    const result = [];
    for (const item of data) {
        for (let i=0; i<times; i++) {
            result.push(item);
        }
    }
    return result;
}

export function expand(data) {
    const result = [];
    let times = 1;
    for (const item of data) {
        for (let i=0; i<times; i++) {
            result.push(item);
        }
        times++;
    }
    return result;
}

export function binary(num) {
    const result = [];
    while(num > 0) {
        result.push(num % 2);
        num = Math.floor(num / 2);
    }
    return result.reverse();
}
