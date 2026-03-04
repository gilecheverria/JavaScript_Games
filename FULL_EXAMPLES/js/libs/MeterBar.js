/*
 * A simple class to display a meter bar, such as a health bar or a mana bar.
 * It consists of two rectangles, one for the frame and one for the content.
 * The content is scaled by a percentage to display the current value of the meter.
 * The colors of the frame and the content can be customized.
 * The margin between the frame and the content can also be customized.
 *
 * Gilberto Echeverria
 * 2026-02-25
 */

"use strict";

import { Rect } from "./Rect.js";

export class MeterBar {
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
