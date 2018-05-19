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
        }
    }
}

Setting.TextInput.prototype.update = function() {

}

Setting.TextInput.prototype.click = function(mouseX, mouseY, self) {

}

Setting.TextInput.prototype.draw = function(mouseX, mouseY, x, y, alpha, self) {
    
}