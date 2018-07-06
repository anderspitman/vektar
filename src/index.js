import { Context } from './vektar';
import { Game } from './game';

const scene = [
  {
    primitiveId: 'planet',
    instances: [
      {
        x: 500,
        y: 250,
        rotationDegrees: 0,
        scale: 0.5,
        showBuilding: true,
      },
      {
        x: 800,
        y: 250,
        rotationDegrees: 0,
        scale: 1.0,
        showBuilding: true,
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
  id: 'planet',
  create: () => {
    const planet = ctx.createGroup()
    const circle = ctx.createCircle()
      .setRadius(100)
    ctx.addToGroup({ group: planet, element: circle });

    const building = ctx.createRectangle()
    planet.addChildWithId({ id: 'building', child: building });
    return planet;
  },
  render: ({ object, state }) => {
    const planet = object;

    if (state.showBuilding) {
      const building = planet.getChildById('building');
      building.setVisible(true);
    }
  }
});

ctx.setBackgroundColor('black');

//let cameraX = worldWidth / 2;
//let cameraY = worldHeight / 2;

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
