import { Context } from './vektar';
import { Game } from './game';
import { ship, radarBuilding, planet } from './primitives';

const team1Color = 'blue';
const team2Color = 'yellow';

const scene = [
  {
    primitiveId: 'ship',
    instances: [
      {
        x: 20,
        y: 20,
        rotationDegrees: 0,
        scale: 1.0,
        color: team1Color,
      }
    ]
  },
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

ctx.registerPrimitive(ship);
ctx.registerPrimitive(radarBuilding);
ctx.registerPrimitive(planet);

ctx.setBackgroundColor('black');

//let cameraX = worldWidth / 2;
//let cameraY = worldHeight / 2;

//ctx.render({ scene });

const keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

function step() {
  //ctx.setViewportPosition({ x: cameraX, y: cameraY });
  //cameraX += 1;
  //cameraY += 1;
  //
  const rotationStep = 3.0;

  if (keys[37]) {
    scene[0].instances[0].rotationDegrees -= rotationStep;
  }
  else if (keys[39]) {
    scene[0].instances[0].rotationDegrees += rotationStep;
  }

  scene[0].instances[0].thrustersOn = keys[38];

  ctx.render({ scene });
  requestAnimationFrame(step);
}
requestAnimationFrame(step);
