/**
 * Represents a color picker setting.
 * Example usage can be found in UseExample.js
 * 
 * @constructor
 * @param {String} name the name of the setting
 * @param {Array.<number>} value the default value of the setting
 */
Settings.prototype.ColorPicker = function(name, value) {
    this.type = "color_picker";

    this.name = name;
    this.value = value;

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
Setting.ColorPicker.prototype.setHidden = function(hidden) {
    this.hidden = hidden;
    return this;
}

/**
 * Helper function to update the setting's animations.
 * This is used internally and is not meant for public use.
 */
Setting.ColorPicker.prototype.update = function() {
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
Setting.ColorPicker.prototype.click = function(mouseX, mouseY, self) {
    if (mouseY < this.handler.pos.y + 14 || mouseY > this.handler.pos.y + 19) return;

    slideWidth = self.width / 3 - 15;
    if (mouseX > this.handler.pos.x && mouseX < this.handler.pos.x + slideWidth) {
        this.value[0] = Math.floor(MathLib.map(mouseX, this.handler.pos.x, this.handler.pos.x + slideWidth, 0, 255));
        self.save();
    } else if (mouseX > this.handler.pos.x + slideWidth + 5 && mouseX < this.handler.pos.x + slideWidth * 2 + 5) {
        this.value[1] = Math.floor(MathLib.map(mouseX, this.handler.pos.x + 70, this.handler.pos.x + slideWidth * 2 + 5, 0, 255));
        self.save();
    } else if (mouseX > this.handler.pos.x + slideWidth * 2 + 10 && mouseX < this.handler.pos.x + slideWidth * 3 + 10) {
        this.value[2] = Math.floor(MathLib.map(mouseX, this.handler.pos.x + slideWidth * 2 + 10, this.handler.pos.x + slideWidth * 3 + 10, 0, 255));
        self.save();
    }
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
Setting.ColorPicker.prototype.draw = function(mouseX, mouseY, x, y, alpha, self) {
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

    slideWidth = self.width / 3 - 15;
    Renderer.drawRect(
        Renderer.color(this.value[0], 0, 0, alpha),
        x, y + 15, slideWidth, 3
    );

    Renderer.drawRect(
        Renderer.color(255, 255, 255, alpha),
        x + MathLib.map(this.value[0], 0, 255, 0, slideWidth), y + 14,
        1, 5
    )

    Renderer.drawRect(
        Renderer.color(0, this.value[1], 0, alpha),
        x + slideWidth + 5, y + 15, slideWidth, 3
    )

    Renderer.drawRect(
        Renderer.color(255, 255, 255, alpha),
        x + slideWidth + 5 + MathLib.map(this.value[1], 0, 255, 0, slideWidth), y + 14,
        1, 5
    )

    Renderer.drawRect(
        Renderer.color(0, 0, this.value[2], alpha),
        x + slideWidth * 2 + 10, y + 15, slideWidth, 3
    )

    Renderer.drawRect(
        Renderer.color(255, 255, 255, alpha),
        x + slideWidth * 2 + 10 + MathLib.map(this.value[2], 0, 255, 0, slideWidth), y + 14,
        1, 5
    )

    Renderer.drawRect(
        Renderer.color(this.value[0], this.value[1], this.value[2], alpha),
        x + self.width - 30, y, 20, 20
    )

    return 25;
}