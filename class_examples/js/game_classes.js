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
    }
}


class GameObject {
    constructor(position, width, height, color, type) {
        this.position = position;
        this.size = new Vec(width, height);
        this.halfSize = new Vec(width / 2, height / 2);
        this.color = color;
        this.type = type;

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
        let xMargin = (this.size.x - width) / 2;
        let yMargin = (this.size.y - height) / 2;
        this.xOffset = this.halfSize.x - xMargin;
        this.yOffset = this.halfSize.y - yMargin;
        this.colliderWidth = width;
        this.colliderHeight = height;
        this.updateCollider();
    }

    // Create the collider directly as a rectangle to be tested
    updateCollider() {
        this.collider = new Rect(this.position.x - this.xOffset * scale,
                                 this.position.y - this.yOffset * scale,
                                 this.colliderWidth * scale,
                                 this.colliderHeight * scale);
    }

    // Use a default scale of 1 if not provided
    draw(ctx, scale = 1) {
        if (this.spriteImage) {
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.position.x,
                              this.spriteRect.position.y,
                              this.spriteRect.width,
                              this.spriteRect.height,
                              (this.position.x - this.halfSize.x * scale),
                              (this.position.y - this.halfSize.y * scale),
                              this.size.x * scale,
                              this.size.y * scale);
            } else {
                ctx.drawImage(this.spriteImage,
                              (this.position.x - this.halfSize.x * scale),
                              (this.position.y - this.halfSize.y * scale),
                              this.size.x * scale,
                              this.size.y * scale);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect((this.position.x - this.halfSize.x * scale),
                         (this.position.y - this.halfSize.y * scale),
                         this.size.x * scale,
                         this.size.y * scale);
        }

        if (showBBox) this.drawBoundingBox(ctx, scale);
        if (showColl) this.drawCollider(ctx, scale);
    }

    drawBoundingBox(ctx, scale) {
        // Attempt to compose the overlay so it makes the image lighter
        ctx.globalCompositeOperation = "screen";
        // A transparent layer on top
        ctx.fillStyle = "rgb(0.5, 0.5, 0.5, 0.3)";
        ctx.fillRect((this.position.x - this.halfSize.x * scale),
                     (this.position.y - this.halfSize.y * scale),
                     this.size.x * scale,
                     this.size.y * scale);
        // Return to default composition type
        ctx.globalCompositeOperation = "source-over";

        // Draw the bounding box of the sprite
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect((this.position.x - this.halfSize.x * scale),
                 (this.position.y - this.halfSize.y * scale),
                 this.size.x * scale,
                 this.size.y * scale);
        ctx.stroke();

        // A dot in the center of the sprite
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
    // Get the colliders for the objects
    col1 = obj1.collider;
    col2 = obj2.collider;
    // Identify the borders of each collider
    const col1Left = col1.position.x;
    const col1Right = col1.position.x + col1.width;
    const col1Top = col1.position.y;
    const col1Bottom = col1.position.y + col1.height;
    const col2Left = col2.position.x;
    const col2Right = col2.position.x + col2.width;
    const col2Top = col2.position.y;
    const col2Bottom = col2.position.y + col2.height;

    // Compare to identify a collision
    return col1Right > col2Left &&
           col1Left < col2Right &&
           col1Bottom > col2Top &&
           col1Top < col2Bottom;
}


function randomRange(size, start) {
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}
