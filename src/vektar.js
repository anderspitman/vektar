import { Renderable, svgNS } from './renderable';

export class Context {
  constructor({ domElementId, canvasSize }) {
    this.parent = document.getElementById(domElementId);

    const dim = this.parent.getBoundingClientRect();
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttributeNS(null, 'width', dim.width);
    this.svg.setAttributeNS(null, 'height', dim.height);

    this.root = document.createElementNS(svgNS, 'g');
    this.svg.appendChild(this.root);

    this.backgroundRect = document.createElementNS(svgNS, 'rect');
    this.backgroundRect.setAttributeNS(null, 'width', canvasSize.width);
    this.backgroundRect.setAttributeNS(null, 'height', canvasSize.height);
    this.backgroundRect.setAttributeNS(null, 'fill', 'white');
    this.root.appendChild(this.backgroundRect);

    this.parent.appendChild(this.svg);
    this.renderables = {};
    this.objects = [];
  }

  render() {
    for (let obj of this.objects) {
      obj.render();
    }
  }

  setBackgroundColor(color) {
    this.backgroundRect.setAttributeNS(null, 'fill', color);
  }

  setViewportPosition({ x, y }) {
    this.root.setAttributeNS(null, 'transform',
      'translate(' + -x + ', ' + -y + ')')
  }

  registerRenderable({ id, renderableClass }) {
    if (this.renderables[id] !== undefined) {
      throw "Renderable already registered";
    }
    this.renderables[id] = renderableClass;
  }

  instantiateRenderable({ id }) {
    if (this.renderables[id] === undefined) {
      throw "Renderable not registered";
    }

    const obj = new this.renderables[id]();
    this.objects.push(obj);

    const el = obj.getElement();
    this.root.appendChild(el);

    return obj;
  }
}
