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

    normalize() {
        const len = this.length();
        if (len == 0) {
            return new Vec(0, 0);
        }
        return new Vec(this.x / len, this.y / len);
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    directionTo(point) {
        point.minus(this).normalize();
    }

    distanceTo(point) {
        return point.minus(this).length();
    }


}


class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}


class GameObject {
    constructor(color, width, height, x, y, type) {
        this.id = randomRange(9000, 1000);
        this.position = new Vec(x, y);
        this.size = new Vec(width, height);
        this.color = color;
        this.type = type;

        // Sprite properties
        this.spriteImage = undefined;
        this.spriteRect = undefined;
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    draw(ctx, scale) {
        if (this.spriteImage) {
            // Draw a sprite if the object has one defined
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.x * this.spriteRect.width,
                              this.spriteRect.y * this.spriteRect.height,
                              this.spriteRect.width, this.spriteRect.height,
                              this.position.x * scale, this.position.y * scale,
                              this.size.x * scale, this.size.y * scale);
            } else {
                ctx.drawImage(this.spriteImage,
                              this.position.x * scale, this.position.y * scale,
                              this.size.x * scale, this.size.y * scale);
            }
        } else {
            // If there is no sprite asociated, just draw a color square
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x * scale, this.position.y * scale,
                         this.size.x * scale, this.size.y * scale);
        }
    }

    update() {

    }
}

class AnimatedObject extends GameObject {
    constructor(_color, width, height, x, y, type) {
        super("white", width, height, x, y, type);
        // Animation properties
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = 0;

        this.repeat = true;

        // Delay between frames (in milliseconds)
        this.frameDuration = 100;
        this.totalTime = 0;
    }

    setAnimation(minFrame, maxFrame, repeat = true, duration = 100) {
        //if (this instanceof Enemy) {
        //    console.log(`Enemy ${this.id} Moving ${this.moveDirection} frames: ${minFrame}, ${maxFrame}`);
        //}
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
    }

    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameDuration) {
            // Loop around the animation frames if the animation is set to repeat
            // Otherwise stay on the last frame
            let restartFrame = (this.repeat ? this.minFrame : this.frame);
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : restartFrame;
            this.spriteRect.x = this.frame % this.sheetCols;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols);
            this.totalTime = 0;
        }
    }
}

class Character extends AnimatedObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
        this.maxHP = 0;
        this.hp = 0;
        this.status = "alive";
    }

    setMaxHP(value) {
        this.maxHP = value;
        this.hp = value;
    }

    takeDamage(amount) {
        this.hp -= amount;
        //console.log(`Character took damage. Now at ${this.hp} / ${this.maxHP}`);
        if (this.hp < 0) {
            this.hp = 0;
            this.status = "dead";
        }
        if (this.hpBar) {
            this.hpBar.update(this.hp / this.maxHP);
        }
    }
}


class Bullet extends AnimatedObject {
    constructor(color, width, height, x, y, type) {
        super(color, width, height, x, y, type);
        this.velocity = new Vec(0, 0);
        this.destroy = false;
        this.speed = 0.005;
        this.angle = 0;
    }

    setVelocity(dirX, dirY) {
        const moveVector = new Vec(dirX, dirY).minus(this.position).normalize();
        this.angle = Math.atan2(moveVector.y, moveVector.x);
        this.velocity = moveVector.times(this.speed);
    }

    update(level, deltaTime) {
        // Find out where the bullet should end if it moves
        let newPosition = this.position.plus(this.velocity.times(deltaTime));

        // Move only if the bullet does not move inside a wall
        if (! level.contact(newPosition, this.size, 'wall')) {
            this.position = newPosition;
        } else {
            this.destroy = true;
        }

        this.updateFrame(deltaTime);
    }

    // Override the parent's draw method
    draw(ctx, scale) {
        // Store the current transformation matrix
        ctx.save();
        // Apply the required rotation around the bullet center
        ctx.translate(this.position.x * scale, this.position.y * scale);
        ctx.rotate(this.angle);
        ctx.translate(-this.position.x * scale, -this.position.y * scale);
        // Draw the bullet
        ctx.drawImage(this.spriteImage,
                      this.spriteRect.x * this.spriteRect.width,
                      this.spriteRect.y * this.spriteRect.height,
                      this.spriteRect.width, this.spriteRect.height,
                      this.position.x * scale, this.position.y * scale,
                      this.size.x * scale, this.size.y * scale);
        // Recover any previous transformations
        ctx.restore();
    }
}


class TextLabel {
    constructor(x, y, font, color) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }

    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}

class MeterBar {
    constructor(x, y, width, height, bgColor, fgColor, margin) {
        // Two rectangles to be drawn to display the frame and the content
        this.frame = new Rect(x, y, width, height);
        this.content = new Rect(x + margin, y + margin,
                                width - 2 * margin, height - 2 * margin);
        this.bgColor = bgColor;
        this.fgColor = fgColor;

        // A factor to multiply the content by
        this.percent = 1;
    }

    update(percent) {
        this.percent = percent;
    }

    draw(ctx) {
        // Draw the frame
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(this.frame.x, this.frame.y,
                     this.frame.width, this.frame.height);
        // Draw the content, scaled by the percent
        ctx.fillStyle = this.fgColor;
        ctx.fillRect(this.content.x, this.content.y,
                     this.content.width * this.percent, this.content.height);
    }

}

// Simple collision detection between rectangles
function overlapRectangles(actor1, actor2) {
    return actor1.position.x + actor1.size.x > actor2.position.x &&
           actor1.position.x < actor2.position.x + actor2.size.x &&
           actor1.position.y + actor1.size.y > actor2.position.y &&
           actor1.position.y < actor2.position.y + actor2.size.y;
}

function randomRange(size, start) {
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}
