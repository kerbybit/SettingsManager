/**
 * Represents an on/off toggle setting.
 * Example usage can be found in UseExample.js
 * 
 * @constructor
 * @param {String} name the name of the setting
 * @param {boolean} value the default value of the setting
 */
Settings.prototype.Toggle = function(name, value) {
    this.type = "toggle";

    this.name = name;
    this.value = value;

    this.handler = {
        pos: {},
        slider: {
            x: 0,
            color: 255
        },
        hover: {
            hover: false,
            alpha: 0,
            height: 0
        }
    }
}

/**
 * Helper function to update the setting's animations.
 * This is used internally and is not meant for public use.
 */
Setting.Toggle.prototype.update = function() {
    if (this.value) {
        this.handler.slider.x       = easeOut(this.handler.slider.x,        25,     10, 0.1);
        this.handler.slider.color   = easeOut(this.handler.slider.color,    0,      10, 1);
    } else {
        this.handler.slider.x       = easeOut(this.handler.slider.x,        0,      10, 0.1);
        this.handler.slider.color   = easeOut(this.handler.slider.color,    255,    10, 1);
    }

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
Setting.Toggle.prototype.click = function(mouseX, mouseY, self) {
    if (mouseX > this.handler.pos.x + self.width - 60 
    && mouseX < this.handler.pos.x + self.width - 10
    && mouseY > this.handler.pos.y
    && mouseY < this.handler.pos.y + 13) {
        this.value = !this.value;
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
Setting.Toggle.prototype.draw = function(mouseX, mouseY, x, y, alpha, self) {
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
        x + self.width - 60, y - 1, 50, 13
    );

    Renderer.drawRect(
        Renderer.color(
            this.handler.slider.color,
            255 - this.handler.slider.color,
            0, alpha
        ),
        x + self.width - 60 + this.handler.slider.x, y - 1, 25, 13
    );

    Renderer.text(
        "on",
        x + self.width - 28, y + 2
    ).setColor(
        Renderer.color(
            this.handler.slider.color,
            this.handler.slider.color,
            this.handler.slider.color,
            alpha
        )
    ).draw()

    Renderer.text(
        "off",
        x + self.width - 55, y + 2
    ).setColor(
        Renderer.color(
            255 - this.handler.slider.color,
            255 - this.handler.slider.color,
            255 - this.handler.slider.color,
            alpha
        )
    ).draw()

    return 15;
}