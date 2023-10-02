import { Point } from './lib/point';
import { Rect } from './lib/shapes/rect';
import { Size } from './lib/size';
import { Space } from './lib/space';

const space = new Space(document.getElementById("canvas") as HTMLCanvasElement);


const rect = new Rect(new Point(40, -200), new Size(200, 120));

space.addShape(rect);

rect.on('click', () => {
  console.log('rect clicked');
  return true;
});

rect.on('keydown', state => {
  const amount = state.shiftKey ? 10 : 1;

  if (state.key === 'ArrowRight')
    rect.setPos(new Point(rect.pos().x + amount, rect.pos().y));
  else if (state.key === 'ArrowLeft')
    rect.setPos(new Point(rect.pos().x - amount, rect.pos().y));
  else if (state.key === 'ArrowDown')
    rect.setPos(new Point(rect.pos().x, rect.pos().y + amount));
  else if (state.key === 'ArrowUp')
    rect.setPos(new Point(rect.pos().x, rect.pos().y - amount));
});

rect.on('dragstart', state => {
  rect.locals['mouseDownPosOffset'] = new Point(Math.abs(state.mouseViewPos.x - rect.vPos().x), Math.abs(state.mouseViewPos.y - rect.vPos().y));
});

rect.on('drag', state => {
  const mouseDownPosOffset = rect.locals['mouseDownPosOffset'] as Point;

  if (mouseDownPosOffset)
    rect.setPos(new Point(state.mouseViewPos.x - mouseDownPosOffset.x, state.mouseViewPos.y - mouseDownPosOffset.y));
});

space.draw();