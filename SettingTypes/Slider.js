/**
 * Represents a slider setting.
 * Example usage can be found in UseExample.js
 * 
 * @constructor
 * @param {String} name the name of the setting
 * @param {number} value the default value of the setting
 * @param {number} min the min number
 * @param {number} max the max number
 * @param {number} round optional number of decimals to round to (default 0)
 */
Settings.prototype.Slider = function(name, value, min, max, round) {
    this.type = "slider";

    this.name = name;
    this.value = value;
    this.min = min;
    this.max = max;

    this.round = 0;
    if (round != undefined) {
        this.round = round;
    }

    this.hidden = false;

    this.handler = {
        pos: {},
        hover: {
            hover: false,
            alpha: 0,
            height: 0
        }
    }
}

/**
 * Sets the setting hidden value. If hidden, it will not draw in the GUI.
 * 
 * @param {boolean} hidden new hidden value
 * @return {*} this for method chaining
 */
Setting.Slider.prototype.setHidden = function(hidden) {
    this.hidden = hidden;
    return this;
}

/**
 * Helper function to update the setting's animations.
 * This is used internally and is not meant for public use.
 */
Setting.Slider.prototype.update = function() {
    if (this.handler.hover.hover) {
        this.handler.hover.alpha    = easeOut(this.handler.hover.alpha,     130,    10, 1);
        this.handler.hover.height   = easeOut(this.handler.hover.height,    13,     10, 0.1);
    } else {
        this.handler.hover.alpha    = easeOut(this.handler.hover.alpha,     0,      10, 1);
        this.handler.hover.height   = easeOut(this.handler.hover.height,    0,      10, 0.1);
    }
}

/**
 * Helper function to click the setting.
 * This is used internally and is not meant for public use.
 * 
 * @param {number} mouseX 
 * @param {number} mouseY 
 * @param {*} self 
 */
Setting.Slider.prototype.click = function(mouseX, mouseY, self) {
    if (!this.handler.hover.hover) return;

    slideWidth = self.width - 10;
    if (mouseX > this.handler.pos.x && mouseX < this.handler.pos.x + slideWidth) {
        this.value = MathLib.map(mouseX, this.handler.pos.x, this.handler.pos.x + slideWidth, this.min, this.max).toFixed(this.round);
    } else if (mouseX <= this.handler.pos.x) {
        this.value = this.min;
    } else if (mouseX >= this.handler.pos.x + slideWidth) {
        this.value = this.max;
    }
    self.save();
}

/**
 * Helper function to draw the setting.
 * This is used internally and is not meant for public use.
 * 
 * @param {number} mouseX 
 * @param {number} mouseY 
 * @param {number} x 
 * @param {number} y 
 * @param {number} alpha 
 * @param {*} self 
 */
Setting.Slider.prototype.draw = function(mouseX, mouseY, x, y, alpha, self) {
    this.handler.pos = {x: x, y: y}

    this.handler.hover.hover = 
            mouseX > x - 5 
        &&  mouseX < x - 5 + self.width
        &&  mouseY > y
        &&  mouseY < y + 25
        &&  alpha == 255;

    Renderer.drawRect(
        Renderer.color(0, 0, 0, this.handler.hover.alpha),
        x - 5, y + 10 - this.handler.hover.height, self.width, this.handler.hover.height * 2
    );

    Renderer.text(
        this.name,
        x, y
    ).setColor(Renderer.color(255, 255, 255, alpha)).draw();

    slideWidth = self.width - 10;
    Renderer.drawRect(
        Renderer.color(100, 100, 100, alpha),
        x, y + 15, slideWidth, 3
    );

    Renderer.drawRect(
        Renderer.color(255, 255, 255, alpha),
        x + MathLib.map(this.value, this.min, this.max, 0, slideWidth), y + 14,
        1, 5
    );

    Renderer.text(
        this.value,
        x + self.width - Renderer.getStringWidth(this.value) - 10, y
    ).setColor(Renderer.color(255, 255, 255, alpha)).draw();

    return 25;
}