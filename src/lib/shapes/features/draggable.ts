import { Point } from "../../point";
import { Shape } from "../shape";

export const drag = {
  enable(shape: Shape) {
    shape.on('dragstart', state => {
      shape.locals['mouseDownPosOffset'] = new Point((state.mouseViewPos.x - shape.vPos().x), (state.mouseViewPos.y - shape.vPos().y));
    });

    shape.on('drag', state => {
      const mouseDownPosOffset = shape.locals['mouseDownPosOffset'] as Point;

      if (mouseDownPosOffset)
        shape.setPos(new Point(state.mouseViewPos.x - mouseDownPosOffset.x, state.mouseViewPos.y - mouseDownPosOffset.y));
    });
  },

  disable(shape: Shape) {
    shape.off('dragstart');
    shape.off('drag');
  }
}