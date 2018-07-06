export const svgNS = "http://www.w3.org/2000/svg";

// TODO: this has to be declared using the old class syntax because
// it was giving errors the other way. I think some bug in Chrome
export function Renderable() {
  this.state = {
    x: 0,
    y: 0,
    scale: 1.0,
    rotationDegrees: 0,
  };
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
  this.state.x = x;
  this.state.y = y;
  this.updateTransform();
  return this;
}

Renderable.prototype.setScale = function(scale) {
  this.state.scale = scale;
  this.updateTransform();
  return this;
}

Renderable.prototype.setRotationDegrees = function({ angleDegrees }) {
  this.state.rotationDegrees = angleDegrees;
  this.updateTransform();
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

Renderable.prototype.updateTransform = function() {
  this.el.setAttributeNS(null,
    'transform',
    'translate(' + this.state.x + ', ' + this.state.y + ') ' +
    'rotate(' + this.state.rotationDegrees + ') ' +
    'scale(' + this.state.scale + ')')
  return this;
}
