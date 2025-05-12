/*
 * Collection of classes that will be used in the games
 *
 * Gilberto Echeverria
 * 2025-02-25
 */

// Global variables to select whether to display bounding boxes and colliders
let showBBox = false;
let showColl = false;

// Register event listeners to toggle bounding boxes
window.addEventListener('keydown', event => {
    if (event.key == 'y') showBBox = !showBBox;
    if (event.key == 'u') showColl = !showColl;
});

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

    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag == 0) {
            return new Vec(0, 0);
        }
        return new Vec(this.x / mag, this.y / mag);
    }
}


class Rect {
    constructor(x, y, width, height) {
        this.position = new Vec(x, y);
        this.width = width;
        this.height = height;

        this.halfWidth = Math.floor(width / 2);
        this.halfHeight = Math.floor(height / 2);
    }
}


class GameObject {
    constructor(position, width, height, color, type) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;

        this.halfWidth = Math.floor(width / 2);
        this.halfHeight = Math.floor(height / 2);

        // Sprite properties
        this.spriteImage = undefined;
        this.spriteRect = undefined;


        // Intialize a collider with the default object size
        this.setCollider(width, height);
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    setCollider(width, height) {
        let xMargin = (this.width - width) / 2;
        let yMargin = (this.height - height) / 2;
        this.xOffset = this.halfWidth - xMargin;
        this.yOffset = this.halfHeight - yMargin;
        this.colliderWidth = width;
        this.colliderHeight = height;
        this.updateCollider();
    }

    // Create the collider directly as a rectangle to be tested
    updateCollider() {
        this.collider = new Rect(this.position.x - this.xOffset,
                                 this.position.y - this.yOffset,
                                 this.colliderWidth,
                                 this.colliderHeight);
    }

    draw(ctx) {
        if (this.spriteImage) {
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.position.x, // * this.spriteRect.width,
                              this.spriteRect.position.y, // * this.spriteRect.height,
                              this.spriteRect.width, this.spriteRect.height,
                              this.position.x - this.halfWidth,
                              this.position.y - this.halfHeight,
                              this.width, this.height);
            } else {
                ctx.drawImage(this.spriteImage,
                              this.position.x - this.halfWidth,
                              this.position.y - this.halfHeight,
                              this.width, this.height);
                              //this.position.x * scale, this.position.y * scale,
                              //this.width * scale, this.height * scale);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x - this.halfWidth,
                         this.position.y - this.halfHeight,
                         this.width, this.height);
        }

        if (showBBox) this.drawBoundingBox(ctx);
        if (showColl) this.drawCollider(ctx);
    }

    drawBoundingBox(ctx) {
        // Draw the bounding box of the sprite
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(this.position.x - this.halfWidth,
                 this.position.y - this.halfHeight,
                 this.width, this.height);
        ctx.stroke();

        ctx.fillStyle = "rgb(0.5, 0.5, 0.5, 0.5)";
        ctx.fillRect(this.position.x - this.halfWidth,
                     this.position.y - this.halfHeight,
                     this.width, this.height);

        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);
    }

    drawCollider(ctx) {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.rect(this.collider.position.x,
                 this.collider.position.y,
                 this.collider.width,
                 this.collider.height);
        ctx.stroke();
    }

    // Empty template for all GameObjects to be able to update
    update() {

    }
}


// Update 2025-03-12
// Class to control the animation of characters and objects
class AnimatedObject extends GameObject {
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type);
        // Animation properties
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = sheetCols;

        this.repeat = true;

        // Delay between frames (in milliseconds)
        this.frameDuration = 100;
        this.totalTime = 0;
    }

    setAnimation(minFrame, maxFrame, repeat, duration) {
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


// Detect a collision of two box objects
function boxOverlap(obj1, obj2) {
    obj1 = obj1.collider;
    obj2 = obj2.collider;
    // Detect collisions with the rectangle directly
    const obj1Left = obj1.position.x;
    const obj1Right = obj1.position.x + obj1.width;
    const obj1Top = obj1.position.y;
    const obj1Bottom = obj1.position.y + obj1.height;
    const obj2Left = obj2.position.x;
    const obj2Right = obj2.position.x + obj2.width;
    const obj2Top = obj2.position.y;
    const obj2Bottom = obj2.position.y + obj2.height;
    /*
    // Detect collisions adjusting the rectangle to be centered
    // around the object
    const obj1Left = obj1.position.x - obj1.halfWidth;
    const obj1Right = obj1.position.x + obj1.halfWidth;
    const obj1Top = obj1.position.y - obj1.halfHeight;
    const obj1Bottom = obj1.position.y + obj1.halfHeight;
    const obj2Left = obj2.position.x - obj2.halfWidth;
    const obj2Right = obj2.position.x + obj2.halfWidth;
    const obj2Top = obj2.position.y - obj2.halfHeight;
    const obj2Bottom = obj2.position.y + obj2.halfHeight;
    */
    return obj1Right > obj2Left &&
           obj1Left < obj2Right &&
           obj1Bottom > obj2Top &&
           obj1Top < obj2Bottom;
}


function randomRange(size, start) {
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}
