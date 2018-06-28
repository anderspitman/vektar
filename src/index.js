import { Context } from './vektar';
import { Planet } from './renderables/planet';

const ctx = new Context({
  domElementId: 'root'
});

ctx.registerRenderable({
  id: 'planet',
  renderableClass: Planet
});

ctx.setBackgroundColor('black');

const planet = ctx.instantiateRenderable({ id: 'planet' })
  .setPosition({ x: 220, y: 220 })
  .setRotationDegrees({ angleDegrees: 90 })
  .updateState({ hasBuilding: true })

const planet2 = ctx.instantiateRenderable({ id: 'planet' });


function render() {
  planet.setRotationDegrees({ angleDegrees: planet.state.rotationDegrees + 0.5 });
  //planet2.setPosition({ x: planet2.state.x + 1, y: planet2.state.y + 1 });
  ctx.render();
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
