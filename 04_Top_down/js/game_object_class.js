/*
 * Generic class for any game object
 *
 * Gilberto Echeverria
 * 2025-05-02
 */


// Global variables to select whether to display bounding boxes and colliders
let showBBox = false;
let showColl = false;

class GameObject {
    constructor(color, width, height, x, y, type) {
        this.id = randomRange(9000, 1000);
        this.position = new Vec(x, y);
        this.size = new Vec(width, height);
        this.halfSize = new Vec(
            //Math.floor(width / 2),
            //Math.floor(height / 2)
            // No floor, since in this game the objects are being created
            // with a size of 1x1
            width / 2,
            height / 2
        );
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
                              this.spriteRect.width,
                              this.spriteRect.height,
                              (this.position.x - this.halfSize.x) * scale,
                              (this.position.y - this.halfSize.y) * scale,
                              this.size.x * scale,
                              this.size.y * scale);
            } else {
                ctx.drawImage(this.spriteImage,
                              (this.position.x - this.halfSize.x) * scale,
                              (this.position.y - this.halfSize.y) * scale,
                              this.size.x * scale,
                              this.size.y * scale);
            }
        } else {
            // If there is no sprite asociated, just draw a color square
            ctx.fillStyle = this.color;
            ctx.fillRect((this.position.x - this.halfSize.x) * scale,
                         (this.position.y - this.halfSize.y) * scale,
                         this.size.x * scale,
                         this.size.y * scale);
        }
    }

    drawBoundingBox(ctx, scale) {
        // Draw the bounding box of the sprite
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect((this.position.x - this.halfSize.x) * scale,
                 (this.position.y - this.halfSize.y) * scale,
                 this.size.x * scale,
                 this.size.y * scale);
        ctx.stroke();
    }

    update() {

    }
}
