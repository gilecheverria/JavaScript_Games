/*
 * Parser for a simple language called "Egg"
 * As defined in: https://eloquentjavascript.net/12_language.html
 *
 * The language contains:
 * - Function applications
 * - Numbers
 * - Words
 * - Strings
 *
 * NOTE: Still very incomplete. Only the first part has been done
 *
 * Gilberto Echeverria
 * 2025-02-03
 */

// Extract the next token from the string
function parseExpression(program) {
    program = skipSpace(program);
    let match;
    let expr;
    if (match = /^"([^"]*)"/.exec(program)) {
        expr = { type: "value", value: match[1] };
    } else if (match = /^\d+\b/.exec(program)) {
        expr = { type: "value", value: Number(match[0]) };
    } else if (match = /^[^\s(),#"]+/.exec(program)) {
        expr = { type: "word", value: match[0] };
    } else {
        throw new SyntaxError(`Invalid syntax: ${program}`);
    }

    return parseApply(expr, program.slice(match[0].length));
}

// Remove any spaces at the beginning of the string
function skipSpace(string) {
    let first = string.search(/\S/);
    if (first == -1) return "";
    return string.slice(first);
}

// Identify if an expression corresponds to a function call (an application)
function parseApply(expr, program) {
    program = skipSpace(program);
    if (program[0] != "(") {
        return { expr: expr, rest: program };
    }

    program = skipSpace(program.slice(1));
    expr = { type: "apply", operator: expr, args: [] };
    while (program[0] != ")") {
        let arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if (program[0] == ",") {
            program = skipSpace(program.slice(1));
        } else if (program[0] != ")") {
            throw new SyntaxError(`Expected ',' or ')'`);
        }
    }

    return parseApply(expr, program.slice(1));
}

// Main parser function
function parse(program) {
    let {expr, rest} = parseExpression(program);
    if (skipSpace(rest).length > 0) {
        throw new SyntaxError('Unexpected text after program.')
    }
    return expr;
}

//console.log(parse("+(a, 10)"));
console.log(parse("cos(one(a, 10), two(6, 2))"));
