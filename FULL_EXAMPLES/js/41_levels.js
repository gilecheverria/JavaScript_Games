/*
 * String variables with the layout of the levels
 * https://eloquentjavascript.net/16_game.html
 *
 * Gilberto Echeverria
 * 2025-01-22
 */

"use strict";

import { GameObject } from "./libs/GameObject.js";
import { Player } from "./libs/CharacterPlayer.js";
import { Coin } from "./libs/Coin.js";
import { Enemy } from "./libs/Enemy.js";

// Object with the characters that appear in the level description strings
// and their corresponding objects
const LEVEL_CHARS = {
    // Rect defined as offset from the first tile, and size of the tiles
    ".": {objClass: GameObject,
          label: "floor",
          sprite: '../assets/sprites/ProjectUtumno_full.png',
          // Rect params shoul be: x, y, width, height
          rectParams: [12, 17, 32, 32]},
    "#": {objClass: GameObject,
          label: "wall",
          sprite: '../assets/sprites/ProjectUtumno_full.png',
          rectParams: [2, 19, 32, 32]},
    "@": {objClass: Player,
          label: "player",
          sprite: '../assets/sprites/link_sprite_sheet.png',
          rectParams: [0, 0, 120, 130],
          sheetCols: 10,
          startFrame: [0, 0]},
    "$": {objClass: Coin,
          label: "collectible",
          sprite: '../assets/sprites/coin_gold.png',
          rectParams: [0, 0, 32, 32],
          sheetCols: 8,
          startFrame: [0, 7]},
    "E": {objClass: Enemy,
          label: "enemy",
          //sprite: '../assets/sprites/ProjectUtumno_full.png',
          //rectParams: [10, 61, 32, 32)},
          sprite: '../assets/sprites/rotting_zombie-NESW.png',
          rectParams: [0, 0, 48, 64],
          sheetCols: 3,
          startFrame: [7, 7]},
    "B": {objClass: Coin,
          label: "playerBullet",
          sprite: '../assets/sprites/staff-shot-02-30x15.png',
          rectParams: [0, 0, 30, 15],
          sheetCols: 3,
          startFrame: [3, 11]},
};


const GAME_LEVELS = [`
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
............................
.##########################.
.#....$...............E...#.
.#........................#.
.########.......###########.
.#..............#..$......#.
.#......@.......#.......$.#.
.#........................#.
.#....................$...#.
.#########......#.........#.
.#.$.....#......###########.
.#........................#.
.#....................E...#.
.#.$.....#................#.
.##########################.
............................
`];

//if (typeof module != "undefined" && module.exports && (typeof window == "undefined" || window.exports != exports))
//  module.exports = GAME_LEVELS;
//if (typeof global != "undefined" && !global.GAME_LEVELS)
//  global.GAME_LEVELS = GAME_LEVELS;
export { LEVEL_CHARS, GAME_LEVELS };
