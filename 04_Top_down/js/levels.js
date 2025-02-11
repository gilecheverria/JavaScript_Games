/*
 * String variables with the layout of the levels
 * https://eloquentjavascript.net/16_game.html
 *
 * Gilberto Echeverria
 * 2025-01-22
 */

"use strict";


let GAME_LEVELS = [`
................
.##############.
.#....$.......#.
.#............#.
.#......#######.
.#............#.
.#......@.....#.
.#............#.
.##############.
................
`,`
................
.##############.
.#....$.......#.
.#............#.
.#......#######.
.#............#.
.#..#...@.....#.
.#..#.........#.
.##############.
................
`];

if (typeof module != "undefined" && module.exports && (typeof window == "undefined" || window.exports != exports))
  module.exports = GAME_LEVELS;
if (typeof global != "undefined" && !global.GAME_LEVELS)
  global.GAME_LEVELS = GAME_LEVELS;
