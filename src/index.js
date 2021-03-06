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

  render({ state }) {

    // TODO: should be able to call this on super
    for (let renderFunc of this.renderFuncs) {
      renderFunc({ state });
    }

    for (let child of this.children) {
      child.render({ state });
    }
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

  setVertices({ vertex1, vertex2, vertex3 }) {
    const w = this.state.width;
    const h = this.state.height;

    // note: inverted for model coordinates
    this.el.setAttributeNS(null, 'points',
      vertex1.x + ' ' + -vertex1.y + ', ' +
      vertex2.x + ' ' + -vertex2.y + ', ' +
      vertex3.x + ' ' + -vertex3.y);

    return this;
  }
}

export class Context {
  constructor({ domElementId, canvasSize }) {
    this.parent = document.getElementById(domElementId);

    const dim = this.parent.getBoundingClientRect();
    //this.width = dim.width;
    //this.height = dim.height;
    this.width = 640;
    this.height = 480;
    this.canvasSize = canvasSize;
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttributeNS(null, 'width', dim.width);
    this.svg.setAttributeNS(null, 'height', dim.height);

    const viewbox = makeViewboxAttribute({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    });
    console.log(viewbox);
    this.svg.setAttributeNS(null, 'viewBox', viewbox);

    this.root = document.createElementNS(svgNS, 'g');
    this.svg.appendChild(this.root);

    this.backgroundRect = document.createElementNS(svgNS, 'rect');
    this.backgroundRect.setAttributeNS(null, 'width', canvasSize.width);
    this.backgroundRect.setAttributeNS(null, 'height', canvasSize.height);
    this.backgroundRect.setAttributeNS(null, 'y', -canvasSize.height);
    this.backgroundRect.setAttributeNS(null, 'fill', 'white');
    this.root.appendChild(this.backgroundRect);

    this.parent.appendChild(this.svg);

    this.descriptors = {};
    this.scene = {};

    this.builder = new PrimitiveBuilder({ vektarContext: this });
  }

  setBackgroundColor(color) {
    this.backgroundRect.setAttributeNS(null, 'fill', color);
  }

  setViewportPosition({ x, y }) {
    this.root.setAttributeNS(null, 'transform',
      'translate(' + -x + ', ' + y + ')')
    // This doesn't appear to really be smoother
    // TODO: figure out which is faster
    //const viewbox = makeViewboxAttribute({
    //  //x: -this.width / 2,
    //  x: x,
    //  y: -y,
    //  width: this.width,
    //  height: this.height,
    //});
    //console.log(viewbox);
    //this.svg.setAttributeNS(null, 'viewBox', viewbox);
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  definePrimitive({ primitiveId, descriptor }) {

    if (this.descriptors[primitiveId] !== undefined) {
      throw "Primitive already defined";
    }
    this.descriptors[primitiveId] = descriptor;
  }

  createPrimitive({ primitiveId }) {
    const descriptor = this.descriptors[primitiveId];
    const prim = this.builder.processDescriptor(descriptor);
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
      // we have more instances than we need currently rendered, so make
      // them invisible (but don't remove them from the DOM in case we need
      // them later).
      else if (lenDiff >= 0) {
        
        for (let i = 0; i < scene.instances.length; i++) {

          const instance = scene.instances[i];

          instance.setVisible(true);

          if (i >= objectType.instances.length) {
            instance.setVisible(false);
          }
        }
      }

      for (let i = 0; i < objectType.instances.length; i++) {
        const instance = scene.instances[i];
        const state = objectType.instances[i];
        instance.render({ state });
      }
    }
  }
}


class PrimitiveBuilder {

  constructor({ vektarContext }) {
    this.ctx = vektarContext;
  }

  generateCreateFunction(descriptor) {
    const self = this;

    return function() {
      return self.processDescriptor(descriptor);
    };
  }

  processDescriptor(descriptor) {

    let obj;

    switch (descriptor.type) {
      case 'Group':

        const group = this.ctx.createGroup();

        for (let childDescriptor of descriptor.children) {
          const child = this.processDescriptor(childDescriptor);
          group.addChild(child);
        }

        obj = group;
        break;
      case 'Triangle':
        obj = this.createTriangle(descriptor);
          break;
      case 'Circle':
        obj = this.createCircle(descriptor);
          break;
      case 'Rectangle':
        obj = this.createRectangle(descriptor);
          break;
      default:
        throw "Invalid type " + type;
        break;
    }

    // bind standard data
    this.bindData(obj, descriptor.anchor, 'setAnchor');
    this.bindData(obj, descriptor.position, 'setPosition');
    this.bindData(obj, descriptor.rotationDegrees, 'setRotationDegrees');
    this.bindData(obj, descriptor.visible, 'setVisible');
    this.bindData(obj, descriptor.strokeColor, 'setStrokeColor');
    this.bindData(obj, descriptor.fillColor, 'setFillColor');

    return obj;
  }

  bindData(obj, value, methodName) {
    if (value !== undefined) {
      if (this.usesState(value)) {
        const key = this.getKey(value);

        obj.addRenderFunc(function({ state }) {
          obj[methodName](state[key]);
        });
      }
      else {
        obj[methodName](value);
      }
    }
  }

  createCircle(descriptor) {
    const circle = this.ctx.createCircle()
    this.bindData(circle, descriptor.radius, 'setRadius');
    return circle;
  }

  createRectangle(descriptor) {
    const rect = this.ctx.createRectangle()
    this.bindData(rect, descriptor.width, 'setWidth');
    this.bindData(rect, descriptor.height, 'setHeight');
    return rect;
  }

  createTriangle(descriptor) {
    const triangle = this.ctx.createTriangle()
    this.bindData(triangle, descriptor.vertices, 'setVertices');

    return triangle;
  }

  usesState(value) {
    return typeof value === 'string' && value.startsWith('%');
  }

  getKey(value) {
    return value.slice(1);
  }
}

function makeViewboxAttribute({ x, y, width, height }) {
  return x + " " + y + " " + width + " " + height;
}
