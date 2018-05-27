/**
 * Represents a string selector setting.
 * Example usage can be found in UseExample.js
 * 
 * @constructor
 * @param {String} name the name of the setting
 * @param {number} value the default value of the setting
 * @param {Array.<String>} options the string options
 */
Settings.prototype.StringSelector = function(name, value, options) {
    this.type = "string_selector";

    this.name = name;
    this.value = value;
    this.options = options;

    this.hidden = false;

    var textAlphas = [];
    this.options.forEach(function() {
        textAlphas.push(0);
    });

    this.handler = {
        pos: {},
        text: {
            x: 0,
            alphas: textAlphas
        },
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
Settings.prototype.setHidden = function(hidden) {
    this.hidden = hidden;
    return this;
}

/**
 * Helper function to update the setting's animations.
 * This is used internally and is not meant for public use.
 */
Setting.StringSelector.prototype.update = function() {
    this.handler.text.x = easeOut(this.handler.text.x, this.value * 20, 10, 0.1);
    for (var i = 0; i < this.options.length; i++) {
        if (this.value == i) {
            this.handler.text.alphas[i] = easeOut(this.handler.text.alphas[i], 255, 10, 1);
        } else {
            this.handler.text.alphas[i] = easeOut(this.handler.text.alphas[i], 0, 10, 1);
        }
    }

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
Setting.StringSelector.prototype.click = function(mouseX, mouseY, self) {
    if (mouseX > this.handler.pos.x - 5 
    &&  mouseX < this.handler.pos.x - 5 + self.width / 2
    &&  mouseY > this.handler.pos.y
    &&  mouseY < this.handler.pos.y + 25) {
        this.value--;
        if (this.value < 0) this.value = 0;
        self.save();
    }

    if (mouseX > this.handler.pos.x - 5 + self.width / 2
    &&  mouseX < this.handler.pos.x - 5 + self.width
    &&  mouseY > this.handler.pos.y
    &&  mouseY < this.handler.pos.y + 25) {
        this.value++;
        if (this.value > this.options.length - 1) this.value = this.options.length - 1;
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
 * @param {boolean} selected
 */
Setting.StringSelector.prototype.draw = function(mouseX, mouseY, x, y, alpha, self, selected) {
    this.handler.pos = {x: x, y: y};

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

    for (var i = 0; i < this.options.length; i++) {
        var xOffset = i * -20 + this.handler.text.x;
        if (xOffset > 20) xOffset = -20;
        if (xOffset < -20) xOffset = 20;

        var optionText = Renderer.text(
            this.options[i],
            x + xOffset + self.width / 2 - 5 - Renderer.getStringWidth(this.options[i]) / 2,
            y + 11
        )
        
        if (selected && alpha > 0) {
            optionText.setColor(Renderer.color(255, 255, 255, this.handler.text.alphas[i]));
        } else {
            if (alpha > this.handler.text.alphas[i]) {
                optionText.setColor(Renderer.color(255, 255, 255, this.handler.text.alphas[i]));
            } else {
                optionText.setColor(Renderer.color(255, 255, 255, alpha));
            }
        }
        
        optionText.draw();
    }

    Renderer.drawRect(Renderer.color(0, 0, 0, alpha), x, y + 10, 25, 11);
    Renderer.text("<", x + 10, y + 12).setColor(Renderer.color(255, 255, 255, alpha)).draw();

    Renderer.drawRect(
        Renderer.color(0, 0, 0, alpha), x + self.width - 35, y + 10, 25, 11
    );

    Renderer.text(
        ">", x + self.width - 24, y + 12
    ).setColor(Renderer.color(255, 255, 255, alpha)).draw();

    return 25;
}