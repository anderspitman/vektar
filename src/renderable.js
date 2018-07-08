export const svgNS = "http://www.w3.org/2000/svg";

// TODO: this has to be declared using the old class syntax because
// it was giving errors the other way. I think some bug in Chrome
export function Renderable() {
  this.state = {
    x: 0,
    y: 0,
    scale: 1.0,
    rotationDegrees: 0,
    anchorX: 0,
    anchorY: 0,
  };

  this.renderFuncs = [];
}

Renderable.prototype.getDomElement = function() {
  return this.el;
}

Renderable.prototype.setState = function(state) {
  this.state = state;
  return this;
}

Renderable.prototype.updateState = function(update) {
  for (let key in update) {
    this.state[key] = update[key];
  }
  return this;
}

Renderable.prototype.setPosition = function({ x, y }) {
  this.state.x = x - this.state.anchorX;
  this.state.y = y - this.state.anchorY;
  this._updateTransform();
  return this;
}

Renderable.prototype.setScale = function(scale) {
  this.state.scale = scale;
  this._updateTransform();
  return this;
}

Renderable.prototype.setRotationDegrees = function(angleDegrees) {
  this.state.rotationDegrees = angleDegrees;
  this._updateTransform();
  return this;
}

Renderable.prototype.setAnchor = function({ x, y }) {
  this.state.anchorX = x;
  this.state.anchorY = y;
  return this;
}

Renderable.prototype.setVisible = function(visible) {
  this.el.setAttributeNS(null, 'visibility', visible ? 'visible' : 'hidden');
  return this;
}

Renderable.prototype.setStrokeColor = function(color) {
  this.el.setAttributeNS(null, 'stroke', color);
  return this;
}

Renderable.prototype.setFillColor = function(color) {
  this.el.setAttributeNS(null, 'fill', color);
  return this;
}

Renderable.prototype._updateTransform = function() {
  this.el.setAttributeNS(null,
    'transform',
    'translate(' + this.state.x + ', ' + this.state.y + ') ' +
    'rotate(' + this.state.rotationDegrees + ', ' + 
            this.state.anchorX + ', ' + this.state.anchorY +
    ') ' +
    'scale(' + this.state.scale + ')')
  return this;
}

Renderable.prototype.addRenderFunc = function(callback) {
  this.renderFuncs.push(callback);
}

Renderable.prototype.render = function({ state }) {
  for (let renderFunc of this.renderFuncs) {
    renderFunc({ state });
  }
}
