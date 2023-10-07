import { Point } from "../point";
import { Shape } from "../basic-shapes/shape";

export const arrowControl = {
  enable(shape: Shape) {
    shape.on('keydown', state => {
      const amount = state.shiftKey ? 10 : 1;

      if (state.key === 'ArrowRight')
        shape.setPos(new Point(shape.pos().x + amount, shape.pos().y));
      else if (state.key === 'ArrowLeft')
        shape.setPos(new Point(shape.pos().x - amount, shape.pos().y));
      else if (state.key === 'ArrowDown')
        shape.setPos(new Point(shape.pos().x, shape.pos().y + amount));
      else if (state.key === 'ArrowUp')
        shape.setPos(new Point(shape.pos().x, shape.pos().y - amount));
    });
  },

  disable(shape: Shape) {
    shape.off('keydown');
  }
}