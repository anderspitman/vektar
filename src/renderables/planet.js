import { Renderable, svgNS } from '../renderable';

export class Planet extends Renderable {
  constructor() {
    super();

    this.state.hasBuilding = false;

    const el = document.createElementNS(svgNS, 'g');
    //el.className = 'planet';

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttributeNS(null, 'cx', 0);
    circle.setAttributeNS(null, 'cy', 0);
    circle.setAttributeNS(null, 'r', 100);
    circle.setAttributeNS(null, 'fill', 'none');
    circle.setAttributeNS(null, 'stroke', '#1bd100');
    el.appendChild(circle);

    const building = document.createElementNS(svgNS, 'rect');
    building.setAttributeNS(null, 'width', 80);
    building.setAttributeNS(null, 'height', 40);
    building.setAttributeNS(null, 'stroke', 'blue');
    building.setAttributeNS(null, 'x', -40);
    building.setAttributeNS(null, 'y', 30);
    building.setAttributeNS(null, 'visibility', 'hidden');
    el.appendChild(building);
    this.building = building;


    this.el = el;
  }

  renderInternal() {
    this.building.setAttributeNS(null, 'visibility',
      this.state.hasBuilding ? 'visible' : 'hidden');
  }
}
