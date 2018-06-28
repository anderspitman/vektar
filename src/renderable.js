export const svgNS = "http://www.w3.org/2000/svg";

export class Renderable {
  constructor() {
    this.state = {
      x: 0,
      y: 0,
      scale: 1.0,
      rotationDegrees: 0,
    };
  }

  getElement() {
    return this.el;
  }

  setState(state) {
    this.state = state;
    return this;
  }

  updateState(update) {
    for (let key in update) {
      this.state[key] = update[key];
    }
    return this;
  }

  setPosition({ x, y }) {
    this.state.x = x;
    this.state.y = y;
    return this;
  }

  setScale(scale) {
    this.state.scale = scale;
    return this;
  }

  setRotationDegrees({ angleDegrees }) {
    this.state.rotationDegrees = angleDegrees;
    return this;
  }

  render() {
    this.updateTransform();
    this.renderInternal();
    return this;
  }

  updateTransform() {
    this.el.setAttributeNS(null,
      'transform',
      'translate(' + this.state.x + ', ' + this.state.y + ')' +
      'rotate(' + this.state.rotationDegrees + ')' +
      'scale(' + this.state.scale + ')')
    return this;
  }
}
