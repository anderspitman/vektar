import { Renderable, svgNS } from './renderable';

export class Context {
  constructor({ domElementId }) {
    this.root = document.getElementById(domElementId);

    const dim = this.root.getBoundingClientRect();
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttributeNS(null, 'width', dim.width);
    this.svg.setAttributeNS(null, 'height', dim.height);

    this.backgroundRect = document.createElementNS(svgNS, 'rect');
    this.backgroundRect.setAttributeNS(null, 'width', dim.width);
    this.backgroundRect.setAttributeNS(null, 'height', dim.height);
    this.backgroundRect.setAttributeNS(null, 'fill', 'white');
    this.svg.appendChild(this.backgroundRect);

    this.root.appendChild(this.svg);
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
    this.svg.appendChild(el);

    return obj;
  }
}
