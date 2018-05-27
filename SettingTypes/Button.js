/**
 * Represents a button setting.
 * Example usage can be found in UseExample.js
 * 
 * @param {String} name the name of the setting
 * @param {String} text the text on the button
 * @param {function} method the function to run when the button is clicked
 */
Settings.prototype.Button = function(name, text, method) {
    this.type = "button";

    this.name = name;
    this.text = text;
    this.method = method;

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
Setting.Button.prototype.setHidden = function(hidden) {
    this.hidden = hidden;
    return this;
}

/**
 * Helper function to update the setting's animations.
 * This is used internally and is not meant for public use.
 */
Setting.Button.prototype.update = function() {
    if (this.handler.hover.hover) {
        this.handler.hover.alpha    = easeOut(this.handler.hover.alpha,     130,    10, 1);
        this.handler.hover.height   = easeOut(this.handler.hover.height,    8,      10, 0.1);
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
Setting.Button.prototype.click = function(mouseX, mouseY, self) {
    if (mouseX > this.handler.pos.x + self.width - Renderer.getStringWidth(this.text) - 60
        && mouseX < this.handler.pos.x + self.width - 10
        && mouseY > this.handler.pos.y
        && mouseY < this.handler.pos.y + 13) {
            this.method();
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
Setting.Button.prototype.draw = function(mouseX, mouseY, x, y, alpha, self) {
    this.handler.pos = {x: x, y: y};

    this.handler.hover.hover = 
            mouseX > x - 5 
        &&  mouseX < x - 5 + self.width
        &&  mouseY > y
        &&  mouseY < y + 15
        &&  alpha == 255;

    Renderer.drawRect(
        Renderer.color(0, 0, 0, this.handler.hover.alpha),
        x - 5, y + 5 - this.handler.hover.height, self.width, this.handler.hover.height * 2
    )

    Renderer.text(
        this.name,
        x, y
    ).setColor(Renderer.color(255, 255, 255, alpha)).draw();

    Renderer.drawRect(
        Renderer.color(0, 0, 0, alpha),
        x + self.width - Renderer.getStringWidth(this.text) - 60, y - 1, Renderer.getStringWidth(this.text) + 50, 13
    );

    Renderer.text(
        this.text,
        x + self.width - Renderer.getStringWidth(this.text) - 35, y + 2
    ).setColor(Renderer.color(255, 255, 255, alpha)).draw();

    return 15;
}