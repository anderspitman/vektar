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

    this.el = document.createElementNS(svgNS, 'rect');
    //rect.setAttributeNS(null, 'stroke', 'blue');
    //rect.setAttributeNS(null, 'visibility', 'hidden');
  }

  setWidth(width) {
    this.el.setAttributeNS(null, 'width', width);
    return this;
  }

  setHeight(height) {
    this.el.setAttributeNS(null, 'height', height);
    return this;
  }
}

class Triangle extends Renderable {
  constructor() {
    super();

    this.el = document.createElementNS(svgNS, 'polygon');
  }

  setWidth(width) {
    this.state.width = width;
    return this;
  }

  setHeight(height) {
    this.state.height = height;
    return this;
  }

  setVertices({ vertex1, vertex2, vertex3 }) {
    const w = this.state.width;
    const h = this.state.height;

    this.el.setAttributeNS(null, 'points',
      vertex1.x * w + ' ' + vertex1.y * h + ', ' +
      vertex2.x * w + ' ' + vertex2.y * h + ', ' +
      vertex3.x * w + ' ' + vertex3.y * h + ', ');

    return this;
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

    const self = this;

    function NewPrimitive() {
      Renderable.call(this);

      this.ctx = self;
    };
    NewPrimitive.prototype = Object.create(Renderable.prototype);
    NewPrimitive.prototype.constructor = NewPrimitive;
    NewPrimitive.prototype.create = create;
    NewPrimitive.prototype.render = render;

    this.primitives[id] = NewPrimitive;
  }

  createPrimitive({ primitiveId }) {
    const prim = new this.primitives[primitiveId]();
    prim.obj = prim.create();
    prim.el = prim.obj.el;
    return prim;
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

  createTriangle() {
    return new Triangle();
  }

  render({ scene }) {
    for (let objectType of scene) {

      if (this.scene[objectType.primitiveId] === undefined) {
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
        instance.updateTransform();
        instance.render({ state });
      }
    }
  }
}
