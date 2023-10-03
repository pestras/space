import { Point } from './lib/point';
import { Circle } from './lib/shapes/circle';
import { Rect } from './lib/shapes/rect';
import { Size } from './lib/size';
import { Space } from './lib/space';

const space = new Space(document.getElementById("canvas") as HTMLCanvasElement);


const rect = new Rect(new Point(40, -200), new Size(200, 120));

rect.draggable = true;
rect.arrowControl = true;
rect.on('click', () => {
  console.log('rect clicked');
  return true;
});

space.addShape(rect);

const circle = new Circle(new Point(-200, -50), 100);

circle.draggable = true;
circle.arrowControl = true;
circle.on('click', () => {
  console.log('circle clicked');
  return true;
});

space.addShape(circle);


space.draw();