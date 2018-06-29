import { Context } from './vektar';
import { Planet } from './renderables/planet';

const worldWidth = 10000;
const worldHeight = 10000;

const ctx = new Context({
  domElementId: 'root',
  canvasSize: {
    width: worldWidth,
    height: worldHeight,
  }
});

ctx.registerRenderable({
  id: 'planet',
  renderableClass: Planet
});

ctx.setBackgroundColor('black');

const planet = ctx.instantiateRenderable({ id: 'planet' })
  .setPosition({ x: worldWidth / 2 + 500, y: worldHeight / 2 + 500 })
  .setRotationDegrees({ angleDegrees: 90 })
  .updateState({ hasBuilding: true })

const planet2 = ctx.instantiateRenderable({ id: 'planet' })
  .setPosition({ x: 1220, y: 1220 })

let cameraX = worldWidth / 2;
let cameraY = worldHeight / 2;

function step() {
  planet.setRotationDegrees({ angleDegrees: planet.state.rotationDegrees + 0.5 });
  //planet2.setPosition({ x: planet2.state.x + 1, y: planet2.state.y + 1 });
  ctx.setViewportPosition({ x: cameraX, y: cameraY });
  cameraX += 1;
  cameraY += 1;
  ctx.render();
  requestAnimationFrame(step);
}
requestAnimationFrame(step);
