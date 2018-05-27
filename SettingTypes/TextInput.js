Settings.prototype.TextInput = function(name, text) {
    this.type = "text_input";

    this.name = name;
    this.text = text;

    this.hidden = false;

    this.handler = {
        pos: {},
        hover: {
            hover: false,
            alpha: 0,
            height: 0
        },
        selected: false,
        cursor: {
            pos: 0,
            step: 0
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
 * Helper function to update the setting's key typed.
 * This is used internally and is not meant for public use.
 * 
 * @param {string} char 
 * @param {number} keycode 
 * @param {*} self 
 */
Setting.TextInput.prototype.keyType = function(char, keycode, self) {
    if (!this.handler.selected) return;

    this.handler.cursor.step = -30;

    if (keycode == 199) { // home
        this.handler.cursor.pos = 0;
        return;
    }

    if (keycode == 207) { // end
        this.handler.cursor.pos = this.text.length;
        return;
    }

    if (keycode == 203 && this.handler.cursor.pos > 0) { // left
        this.handler.cursor.pos--;
        return;
    }

    if (keycode == 205 && this.handler.cursor.pos < this.text.length) { // right
        this.handler.cursor.pos++;
        return;
    }

    // backspace
    if (keycode == 14 && this.handler.cursor.pos > 0) {
        this.text = this.text.slice(0, this.handler.cursor.pos - 1) + this.text.slice(this.handler.cursor.pos);
        this.handler.cursor.pos--;
        self.save();
        return;
    }

    //del
    if (keycode == 211 && this.handler.cursor.pos < this.text.length) {
        this.text = this.text.slice(0, this.handler.cursor.pos) + this.text.slice(this.handler.cursor.pos+1);
        self.save();
        return;
    }

    // paste
    var shouldPaste = false;
    if (keycode == 47) {
        if (Client.getMinecraft().field_142025_a) { // mac
            if (Keyboard.isKeyDown(219) || Keyboard.isKeyDown(220)) {
                shouldPaste = true;
            }
        } else { // literally everything else
            if (Keyboard.isKeyDown(29) || Keyboard.isKeyDown(157)) {
                shouldPaste = true;
            }
        }
    }
    if (shouldPaste) {
        var transferable = Toolkit.getDefaultToolkit().getSystemClipboard().getContents(null);
        if (transferable != null && transferable.isDataFlavorSupported(DataFlavor.stringFlavor)) {
            this.text = 
                this.text.slice(0, this.handler.cursor.pos) 
                + transferable.getTransferData(DataFlavor.stringFlavor)
                + this.text.slice(this.handler.cursor.pos);
        }
        self.save();
        return;
    }

    // text
    if (char.toString().match(/[\x20-\x7E]/g)) {
        this.text = 
            this.text.slice(0, this.handler.cursor.pos) 
            + char 
            + this.text.slice(this.handler.cursor.pos);
        this.handler.cursor.pos++;
        self.save();
        return;
    }
}

/**
 * Helper function to update the setting's animations.
 * This is used internally and is not meant for public use.
 */
Setting.TextInput.prototype.update = function() {
    if (this.handler.selected) {
        this.handler.cursor.step++;
        if (this.handler.cursor.step > 60) {
            this.handler.cursor.step = 0;
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
Setting.TextInput.prototype.click = function(mouseX, mouseY, self) {
    if (this.handler.selected) {
        var x1 = this.handler.pos.x + self.width - Renderer.getStringWidth(this.text, false) - 12;
        var x2 = x1 + Renderer.getStringWidth(this.text, false) + 1;
        var y1 = this.handler.pos.y - 2;
        var y2 = y1 + 11;

        if (Client.getMouseY() > y1 && Client.getMouseY() < y2) {
            if (Client.getMouseX() <= x1) {
                this.handler.cursor.pos = 0;
            } else if (Client.getMouseX() >= x2) {
                this.handler.cursor.pos = this.text.length;
            } else {
                for (var i = 0; i <= this.text.length; i++) {
                    var t = x1 + Renderer.getStringWidth(this.text.slice(0, i), false);
                    if (Client.getMouseX() <= t) {
                    var left = t - Renderer.getStringWidth(this.text.slice(i - 1, i), false);
                    var right = t + Renderer.getStringWidth(this.text.slice(i - 1, i), false) / 2;
                    this.handler.cursor.pos = (Client.getMouseX() - left > right - Client.getMouseX()) ? i : i-1;
                    return;
                    }
                }
            }
        }
    }

    if (!this.handler.selected && this.handler.hover.hover) {
        this.handler.cursor.pos = this.text.length;
    }
    this.handler.selected = this.handler.hover.hover;
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
Setting.TextInput.prototype.draw = function(mouseX, mouseY, x, y, alpha, self) {
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

    if (this.handler.selected) {
        Renderer.drawRect(
            Renderer.color(0, 0, 0, alpha),
            x + self.width - Renderer.getStringWidth(this.text, false) - 12, y - 2,
            Renderer.getStringWidth(this.text, false) + 1, 11
        );

        Renderer.text(
            this.text,
            x + self.width - Renderer.getStringWidth(this.text, false) - 10, y
        ).setFormatted(false).setColor(Renderer.color(255, 255, 255, alpha)).draw();

        if (this.handler.cursor.step < 30) {
            var cursorPos = 
                x + self.width - 10
                - Renderer.getStringWidth(this.text, false) 
                + Renderer.getStringWidth(this.text.slice(0, this.handler.cursor.pos), false);

            Renderer.drawRect(
                Renderer.color(255, 255, 255, alpha),
                cursorPos, y - 2,
                1, 11
            );
        }
    } else {
        Renderer.text(
            this.text,
            x + self.width - Renderer.getStringWidth(this.text) - 10, y
        ).setColor(Renderer.color(255, 255, 255, alpha)).draw();
    }

    return 25;
}
