import { Context } from './vektar';
import { Game } from './game';
import { radarBuilding, planet } from './primitives';

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

ctx.definePrimitive(radarBuilding);
ctx.definePrimitive(planet);

ctx.setBackgroundColor('black');

//let cameraX = worldWidth / 2;
//let cameraY = worldHeight / 2;

//ctx.render({ scene });

function step() {
  //ctx.setViewportPosition({ x: cameraX, y: cameraY });
  //cameraX += 1;
  //cameraY += 1;
  //scene[0].instances[0].rotationDegrees += 0.5;
  //scene[0].instances[1].rotationDegrees -= 0.5;
  ctx.render({ scene });
  requestAnimationFrame(step);
}
requestAnimationFrame(step);
