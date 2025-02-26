/*
 * General classes that can be useful for a game
 *
 * Gilberto Echeverria
 * 2025-01-22
 */

"use strict";

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    times(factor) {
        return new Vec(this.x * factor, this.y * factor);
    }

    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}


class GameObject {
    constructor(color, width, height, x, y, type) {
        this.position = new Vec(x, y);
        this.size = new Vec(width, height);
        this.color = color;
        this.type = type;
        this.spriteImage = undefined;
    }

    setSprite(imagePath) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
    }

    draw(ctx, scale) {
        if (this.spriteImage) {
            ctx.drawImage(this.spriteImage, this.position.x * scale, this.position.y * scale, this.size.x * scale, this.size.y * scale);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x * scale, this.position.y * scale, this.size.x * scale, this.size.y * scale);
        }
    }

    update() {

    }
}


class TextLabel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx, text) {
        ctx.font = "25px Ubuntu Mono";
        ctx.fillStyle = "black";
        ctx.fillText(text, this.x, this.y);
    }
}


// Simple collision detection between rectangles
function overlapRectangles(actor1, actor2) {
    return actor1.position.x + actor1.size.x > actor2.position.x &&
           actor1.position.x < actor2.position.x + actor2.size.x &&
           actor1.position.y + actor1.size.y > actor2.position.y &&
           actor1.position.y < actor2.position.y + actor2.size.y;
}
