import { Point } from './lib/point';
import { Circle } from './lib/shapes/circle';
import { Rect } from './lib/shapes/rect';
import { Text } from './lib/shapes/text';
import { Size } from './lib/size';
import { Space } from './lib/space';

const space = new Space(document.getElementById("canvas") as HTMLCanvasElement);

// rect
// ----------------------------------------------------------------------------
const rect = new Rect(new Point(30, 30), new Size(242, 300));

rect.draggable = true;
rect.arrowControl = true;
rect.on('click', () => {
  console.log('rect clicked');
  return true;
});

rect.on('select', () => {
  rect.setStyle({
    strokeStyle: '#446',
    lineWidth: 6,
    opacity: 0.5
  });
});

rect.on('deselect', state => {
  rect.setStyle({
    strokeStyle: state.style.strokeStyle,
    lineWidth: state.style.lineWidth,
    opacity: 1
  });
});

space.addShape(rect);


// circle
// ----------------------------------------------------------------------------
const circle = new Circle(new Point(-200, -50), 100);

circle.draggable = true;
circle.arrowControl = true;
circle.on('click', () => {
  circle.style.fill = '#5B8';
  return true;
});

space.addShape(circle);


// text
// ----------------------------------------------------------------------------
const text = new Text(new Point(30, 30), new Size(242, -1), "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing.");

text.setStyle({ fontSize: 24 });
text.on('mousein', () => {
  text.style.fontColor = '#FFF'
});
text.on('mouseout', state => {
  text.style.fontColor = state.style.fontColor;
});

space.addShape(text);


space.draw();