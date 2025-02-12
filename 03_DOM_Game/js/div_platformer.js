/*
 * Drawing the game using DOM elements
 * As described at:
 * https://eloquentjavascript.net/16_game.html
 *
 * Gilberto Echeverria
 * 2025-01-22
 */

"use strict";

// THIS USED TO BE IN platformer.js

let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;


class Level {
    constructor(plan) {
        // Unpack the level as a matrix of characters
        let rows = plan.trim().split('\n').map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.startActors = [];

        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let type = levelChars[ch];
                if (typeof type !== "string") {
                    let pos = new Vec(x, y);
                    this.startActors.push(type.create(pos, ch));
                    type = "empty";
                }
                return type;
            });
        });
    }

    // Detect contact with the walls of the level
    touches(pos, size, type) {
        let xStart = Math.floor(pos.x);
        let xEnd = Math.ceil(pos.x + size.x);
        let yStart = Math.floor(pos.y);
        let yEnd = Math.ceil(pos.y + size.y);

        for (let y=yStart; y<yEnd; y++) {
            for (let x=xStart; x<xEnd; x++) {
                let isOutside = x < 0 || x >= this.width ||
                    y < 0 || y >= this.height;
                let here = isOutside ? 'wall' : this.rows[y][x];
                if (here === type) return true;
            }
        }
        return false;
    }

}

// General state of the game
class State {
    constructor(level, actors, status) {
        this.level = level;
        this.actors = actors;
        this.status = status;
    }

    static start(level) {
        return new State(level, level.startActors, "playing");
    }

    get player() {
        return this.actors.find(a => a.type === "player");
    }

    update(time, keys) {
        let actors = this.actors.map(actor => actor.update(time, this, keys));
        let newState = new State(this.level, actors, this.status);

        if (newState.status !== 'playing') return newState;

        let player = newState.player;
        if (this.level.touches(player.pos, player.size, 'lava')) {
            return new State(this.level, actors, 'lost');
        }

        for (let actor of actors) {
            if (actor !== player && overlap(actor, player)) {
                newState = actor.collide(newState);
            }
        }
        return newState;
    }
}

class Player {
    constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
        this.size = new Vec(0.8, 1.5);
    }

    get type() { return "player"; }

    static create(pos) {
        return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
    }

    update(time, state, keys) {
        // Horizontal movement
        let xSpeed = 0;
        if (keys.ArrowLeft) xSpeed -= playerXspeed;
        if (keys.ArrowRight) xSpeed += playerXspeed;
        let pos = this.pos;
        let movedX = pos.plus(new Vec(xSpeed * time, 0));
        if (!state.level.touches(movedX, this.size, 'wall')) {
            pos = movedX;
        }

        // Vertical movement
        let ySpeed = this.speed.y + time * gravity;
        let movedY = pos.plus(new Vec(0, ySpeed * time));
        if (!state.level.touches(movedY, this.size, 'wall')) {
            pos = movedY;
        } else if (keys.ArrowUp && ySpeed > 0) {
            ySpeed -= jumpSpeed;
        } else {
            ySpeed = 0;
        }

        return new Player(pos, new Vec(xSpeed, ySpeed));
    }
}


class Lava {
    constructor(pos, speed, reset) {
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
        this.size = new Vec(1, 1);
    }

    get type() { return "lava"; }

    static create(pos, ch) {
        if (ch === '=') {
            return new Lava(pos, new Vec(2, 0));
        } else if (ch === '|') {
            return new Lava(pos, new Vec(0, 2));
        } else if (ch === 'v') {
            return new Lava(pos, new Vec(0, 3), pos);
        }
    }

    collide(state) {
        return new State(state.level, state.actors, 'lost');
    }

    update(time, state) {
        let newPos = this.pos.plus(this.speed.times(time));
        // Check the behaviour, if no collision, move
        if (!state.level.touches(newPos, this.size, "wall")) {
            return new Lava(newPos, this.speed, this.reset);
        // If lava collided and it drips again, restart at initial position
        } else if (this.reset) {
            return new Lava(this.reset, this.speed, this.reset);
        // Otherwise this lava should bounce, by multiplying its speed by -1
        } else {
            return new Lava(this.pos, this.speed.times(-1));
        }
    }
}

class Coin {
    constructor(pos, basePos, wobble) {
        this.pos = pos;
        this.basePos = basePos;
        this.wobble = wobble;
        this.size = new Vec(0.6, 0.6);

        this.wobbleSpeed = 8;
        this.wobbleDist = 0.07;
    }

    get type() { return "coin"; }

    static create(pos) {
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
    }

    collide(state) {
        let filtered = state.actors.filter(a => a !== this);
        let status = state.status;
        if (!filtered.some(a => a.type === 'coin')) status = 'won';
        return new State(state.level, filtered, status);
    }

    update(time) {
        let wobble = this.wobble + time * this.wobbleSpeed;
        let wobblePos = Math.sin(wobble) * this.wobbleDist;
        return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
                        this.basePos, wobble);
    }

}

const levelChars = {
    ".": "empty",
    "#": "wall",
    "+": "lava",
    "@": Player,
    "o": Coin,
    "=": Lava,
    "|": Lava,
    "v": Lava,
};

//let simpleLevel = new Leve(simpleLevelPlan);
//console.log(`Level size: ${simpleLevel.width} by ${simpleLevel.height}`)

// THIS IS THE DISPLAY

function elt(name, attrs, ...children) {
    let dom = document.createElement(name);
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    for (let child of children) {
        dom.appendChild(child);
    }
    return dom;
}

let DOMDisplay = class DOMDisplay {
    constructor(parent, level) {
        this.dom = elt('div', {class: 'game'}, drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }

    clear() { this.dom.remove(); }

    syncState(state) {
        if (this.actorLayer) this.actorLayer.remove();
        this.actorLayer = drawActors(state.actors);
        this.dom.appendChild(this.actorLayer);
        this.dom.className = `game ${state.status}`;
        this.scrollPlayerIntoView(state);
    }

    scrollPlayerIntoView(state) {
        let width = this.dom.clientWidth;
        let height = this.dom.clientHeight;
        let margin = width / 3;

        // Viewport
        let left = this.dom.scrollLeft, right = left + width;
        let top = this.dom.scrollTop, bottom = top + height;

        let player = state.player;
        let center = player.pos.plus(player.size.times(0.5)).times(scale);

        if (center.x < left + margin) {
            this.dom.scrollLeft = center.x - margin;
        } else if (center.x > right - margin) {
            this.dom.scrollLeft = center.x + margin - width;
        }
        if (center.y < top + margin) {
            this.dom.scrollTop = center.y - margin;
        } else if (center.y > bottom - margin) {
            this.dom.scrollTop = center.y + margin - height;
        }
    }
}

const scale = 20;

function drawGrid(level) {
    return elt('table', {
        class: 'background',
        style: `width: ${level.width * scale}px`
    }, ...level.rows.map(row =>
            elt('tr', { style: `height: ${scale}px`},
                ...row.map(type => elt('td', { class: type })))));
}

function drawActors(actors) {
    return elt('div', {}, ...actors.map(actor => {
        let rect = elt('div', { class: `actor ${actor.type}`});
        rect.style.width = `${actor.size.x * scale}px`;
        rect.style.height = `${actor.size.y * scale}px`;
        rect.style.left = `${actor.pos.x * scale}px`;
        rect.style.top = `${actor.pos.y * scale}px`;
        return rect;
    }));
}



function overlap(actor1, actor2) {
    return actor1.pos.x + actor1.size.x > actor2.pos.x &&
           actor1.pos.x < actor2.pos.x + actor2.size.x &&
           actor1.pos.y + actor1.size.y > actor2.pos.y &&
           actor1.pos.y < actor2.pos.y + actor2.size.y;
}


//let simpleLevel = new Level(simpleLevelPlan);
//let display = new DOMDisplay(document.body, simpleLevel);
//display.syncState(State.start(simpleLevel));

// Player behaviour
const playerXspeed = 7;
const gravity = 30;
const jumpSpeed = 17;


function trackKeys(keys) {
    let down = Object.create(null);
    function track(event) {
        if (keys.includes(event.key)) {
            down[event.key] = event.type == 'keydown';
            event.preventDefault();
        }
    }
    window.addEventListener('keydown', track);
    window.addEventListener('keyup', track);
    return down;
}

const arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp']);

function runAnimation(frameFunc) {
    let lastTime = null;
    function frame(time){
        if (lastTime != null) {
            let timeStep = Math.min(time - lastTime, 100) / 1000;
            if (frameFunc(timeStep) === false) return;
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
        runAnimation(time => {
            state = state.update(time, arrowKeys);
            display.syncState(state);
            if (state.status === 'playing') {
                return true;
            } else if (ending > 0) {
                ending -= time;
                return true;
            } else {
                display.clear();
                resolve(state.status);
                return false;
            }
        });
    });
}

async function runGame(plans, Display) {
    let lives = 3;
    for (let level=0; level<plans.length && lives > 0;) {
        console.log(`Starting level ${level} with ${lives} lives`);
        let status = await runLevel(new Level(plans[level]), Display);
        console.log(`Level ${level} status: ${status}`);
        if (status === 'won') {
            level++;
        } else {
            lives--;
            if (lives === 0) {
                console.log('Game over! :-(');
            }
        }
    }
    if (lives > 0) {
        console.log('You won!');
    }
}
