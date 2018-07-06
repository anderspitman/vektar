import { Context } from './vektar';
import { Game } from './game';

const team1Color = 'blue';
const team2Color = 'yellow';

const scene = [
  {
    primitiveId: 'planet',
    instances: [
      {
        x: 500,
        y: 150,
        rotationDegrees: 0,
        scale: 1.0,
        showBuilding: true,
        hasRadar: false,
        color: team1Color,
      },
      {
        x: 800,
        y: 150,
        rotationDegrees: 0,
        scale: 1.0,
        showBuilding: true,
        hasRadar: true,
        color: team2Color,
      },
    ],
  },
];

const worldWidth = 10000;
const worldHeight = 10000;

const ctx = new Context({
  domElementId: 'root',
  canvasSize: {
    width: worldWidth,
    height: worldHeight,
  }
});

ctx.definePrimitive({ 
  id: 'radar-building',
  create: function() {

    const group = ctx.createGroup()
      .setPosition({ x: 0, y: 40 })

    this.building = ctx.createRectangle()
      .setWidth(40)
      .setHeight(20)
    group.addChild(this.building);

    this.dish = ctx.createTriangle()
      .setPosition({ x: 30, y: -20 })
      .setWidth(30)
      .setHeight(30)
      .setVertices({
        vertex1: { x: 0, y: 0 },
        vertex2: { x: 1, y: 1 },
        vertex3: { x: 0.3, y: 0.7 },
      })
    group.addChild(this.dish);

    return group;
  },
  render: function({ state }) {
    this.setVisible(state.hasRadar);
    this.building.setStrokeColor(state.color);
    this.dish.setStrokeColor(state.color);
  }
});

ctx.definePrimitive({
  id: 'planet',
  create: function() {
    const planet = ctx.createGroup()
    const circle = ctx.createCircle()
      .setRadius(100)
    planet.addChild(circle);

    this.teamIndicator = ctx.createRectangle()
      .setWidth(10)
      .setHeight(10)
      .setPosition({ x: -5, y: -5 })
    planet.addChild(this.teamIndicator);

    this.centerBuilding = ctx.createRectangle()
      .setWidth(40)
      .setHeight(40)
      .setPosition({ x: -20, y: -20 })
      .setFillColor('none')
    planet.addChild(this.centerBuilding);

    this.leftBuilding = ctx.createRectangle()
      .setWidth(40)
      .setHeight(80)
      .setPosition({ x: -70, y: -40 })
    planet.addChild(this.leftBuilding);

    this.topBuilding = ctx.createRectangle()
      .setWidth(45)
      .setHeight(30)
      .setPosition({ x: 0, y: -70 })
    planet.addChild(this.topBuilding)

    this.radar = ctx.createPrimitive({
      primitiveId: 'radar-building' });
    planet.addChild(this.radar);
    return planet;
  },
  render: function({ state }) {

    if (state.showBuilding) {
      this.leftBuilding.setVisible(true);
    }

    this.teamIndicator.setStrokeColor(state.color);
    this.teamIndicator.setFillColor(state.color);
    this.centerBuilding.setStrokeColor(state.color);
    this.leftBuilding.setStrokeColor(state.color);
    this.topBuilding.setStrokeColor(state.color);

    this.radar.render({ state });

    //planet.getChildById('radar');
  }
});

ctx.setBackgroundColor('black');

//let cameraX = worldWidth / 2;
//let cameraY = worldHeight / 2;

//ctx.render({ scene });

function step() {
  //ctx.setViewportPosition({ x: cameraX, y: cameraY });
  //cameraX += 1;
  //cameraY += 1;
  scene[0].instances[0].rotationDegrees += 0.5;
  scene[0].instances[1].rotationDegrees -= 0.5;
  ctx.render({ scene });
  requestAnimationFrame(step);
}
requestAnimationFrame(step);
