import { Renderable, svgNS } from './renderable';

// TODO: allow removal of children
class Group extends Renderable {

  constructor() {
    super();

    const g = document.createElementNS(svgNS, 'g');
    this.el = g;

    this.children = [];
    this.idChildren = {};
  }

  addChild(child) {
    this.children.push(child);
    this.el.appendChild(child.getDomElement());
  }

  addChildWithId({ id, child }) {
    this.addChild(child);
    this.idChildren[id] = child;
  }

  getChildById(id) {
    return this.idChildren[id];
  }
}

class Circle extends Renderable {
  constructor() {
    super();

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttributeNS(null, 'cx', 0);
    circle.setAttributeNS(null, 'cy', 0);
    circle.setAttributeNS(null, 'r', 10);
    circle.setAttributeNS(null, 'fill', 'none');
    circle.setAttributeNS(null, 'stroke', '#1bd100');

    this.el = circle;
  }
  
  setRadius(radius) {
    this.el.setAttributeNS(null, 'r', radius);
    return this;
  }
}

class Rectangle extends Renderable {
  constructor() {
    super();

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttributeNS(null, 'width', 80);
    rect.setAttributeNS(null, 'height', 40);
    rect.setAttributeNS(null, 'stroke', 'blue');
    rect.setAttributeNS(null, 'x', -40);
    rect.setAttributeNS(null, 'y', 30);
    rect.setAttributeNS(null, 'visibility', 'hidden');
    this.el = rect;
  }
}

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

    this.primitives = {};
    this.scene = {};
  }

  setBackgroundColor(color) {
    this.backgroundRect.setAttributeNS(null, 'fill', color);
  }

  setViewportPosition({ x, y }) {
    this.root.setAttributeNS(null, 'transform',
      'translate(' + -x + ', ' + -y + ')')
  }

  definePrimitive({ id, create, render }) {
    if (this.primitives[id] !== undefined) {
      throw "Primitive already defined";
    }
    this.primitives[id] = { create, render };
  }

  createPrimitive({ primitiveId }) {
    return this.primitives[primitiveId].create();
  }

  createGroup() {
    return new Group();
  }

  addToGroup({ group, element }) {
    group.addChild(element);
  }

  createCircle() {
    return new Circle();
  }

  createRectangle() {
    return new Rectangle();
  }

  render({ scene }) {
    for (let objectType of scene) {

      if (this.scene[objectType.primitiveId] === undefined) {
        console.log("create new obj");
        this.scene[objectType.primitiveId] = {
          instances: [],
        };
      }

      const scene = this.scene[objectType.primitiveId];

      const lenDiff = scene.instances.length - objectType.instances.length;

      // we need more instances than are currently rendered, so instantiate
      // some more
      if (lenDiff < 0) {
        const diff = Math.abs(lenDiff);
        for (let i = 0; i < diff; i++) {
          const obj = this.createPrimitive({
            primitiveId: objectType.primitiveId,
          });
          scene.instances.push(obj);
          this.root.appendChild(obj.getDomElement());
        }
      }
      // TODO
      // we have more instances than we need currently rendered, so make
      // them invisible (but don't remove them from the DOM in case we need
      // them later).
      else if (lenDiff > 0) {
      }

      for (let i = 0; i < scene.instances.length; i++) {
        const instance = scene.instances[i];
        const state = objectType.instances[i];
        instance.setPosition({ x: state.x, y: state.y });
        instance.setRotationDegrees({ angleDegrees: state.rotationDegrees });
        instance.setScale(state.scale);
        instance.render();
        this.primitives[objectType.primitiveId]
          .render({ object: instance, state });
      }
    }
  }
}
