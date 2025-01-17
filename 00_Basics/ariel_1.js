/*
 * Simple set of functions to start learning a language
 * Based on the exercises proposed by Ariel Ortiz
 *
 * Gilberto Echeverria
 * 2025-01-13
 */

// Simple functions

function fahrenheitToCelsius(temp) {
    return (temp - 32) * 5 / 9;
}

function roots(a, b, c) {
    return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
}

// Conditionals

function sign(number) {
    if (number == 0) {
        return 0;
    } else if (number > 0) {
        return 1;
    } else {
        return -1;
    }
}

function bmi(weight, height) {
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

function factorial(n) {
    return tailFactorial(n, 1);
}

function tailFactorial(n, a) {
    if (n == 0) {
        return a;
    } else {
        return tailFactorial(n - 1, a * n);
    }
}

function pow(n, p) {
    return tailPow(n, p, 1);
}

function tailPow(n, p, a) {
    if (p == 0) {
        return a;
    } else {
        return tailPow(n, p - 1, a * n);
    }
}

/*
function fib(n) {
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

function fib(n) {
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

function duplicate(data) {
    let result = [];
    for(const item of data) {
        result.push(item);
        result.push(item);
    };
    return result;
}

function enlist(data) {
    let result = [];
    for(const item of data) {
        result.push([item]);
    }
    return result;
}

function positives(data) {
    let result = [];
    for(const item of data) {
        if (item > 0) {
            result.push(item);
        }
    }
    return result;
}

export {
    fahrenheitToCelsius,
    roots,
    sign,
    bmi,
    factorial,
    pow,
    fib,
    duplicate,
    enlist,
    positives,
};
