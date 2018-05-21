Settings.prototype.TextInput = function(name, text) {
    this.type = "text_input";

    this.name = name;
    this.text = text;

    this.handler = {
        pos: {},
        hover: {
            hover: false,
            alpha: 0,
            height: 0
        },
        selected: false,
        cursor: {
            position: 0,
            step: 0
        }
    }
}

Setting.TextInput.prototype.keyType = function(keycode, self) {
    if (!this.handler.selected) return;

    this.handler.cursor.step = -30;
}

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

Setting.TextInput.prototype.click = function(mouseX, mouseY, self) {
    this.handler.selected = this.handler.hover.hover;
    if (this.handler.hover.hover) {
        World.playSound("gui.button.press", 1, 100);
    }
}

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
            var cursorPos = x + self.width - 10;

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