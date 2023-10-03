import { Point } from './lib/point';
import { Rect } from './lib/shapes/rect';
import { Size } from './lib/size';
import { Space } from './lib/space';

const space = new Space(document.getElementById("canvas") as HTMLCanvasElement);


const rect = new Rect(new Point(40, -200), new Size(200, 120));

space.addShape(rect);

rect.draggable = true;
rect.arrowControl = true;
rect.on('click', () => {
  console.log('rect clicked');
  return true;
});

space.draw();