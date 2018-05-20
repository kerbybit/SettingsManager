Settings.prototype.TextInput = function(name, text) {
    this.type = "text_input";

    this.name = name;
    this.text = text;

    this.handler = {
        pos: {},
        hover: {
            hover: false,
            alpha: 0,
            height: 0,
            selected: false
        }
    }
}

Setting.TextInput.prototype.update = function() {
    if (this.handler.hover.hover) {
        this.handler.hover.alpha    = easeOut(this.handler.hover.alpha,     130,    10, 1);
        this.handler.hover.height   = easeOut(this.handler.hover.height,    13,     10, 0.1);
    } else {
        this.handler.hover.alpha    = easeOut(this.handler.hover.alpha,     0,      10, 1);
        this.handler.hover.height   = easeOut(this.handler.hover.height,    0,      10, 0.1);
    }
}

Setting.TextInput.prototype.click = function(mouseX, mouseY, self) {
    this.handler.selected = this.handler.hover;
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

    Renderer.text(
        this.text,
        x + self.width - Renderer.getStringWidth(this.text), y
    ).setColor(Renderer.color(255, 255, 255, alpha)).draw();

    return 25;
}