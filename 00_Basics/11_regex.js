/*
 * Using regular expressions in JavaScript
 *
 * Gilberto Echeverria
 * 2025-01-28
 */

"use strict";

// Two ways of defining a regular expression
let regex1 = new RegExp("xzcv");
let regex2 = /xzcv/;

// Using a regex to search within a string
let data = "This is the xzcv test string";
let result;
result = regex2.test(data);
console.log(result);

// Getting the matching string
result = regex2.exec(data);
console.log(result);
