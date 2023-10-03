import { Point } from "../point";
import { State } from "../state";
import { Vector } from "../vector";
import { Shape } from "./shape";

export class Circle extends Shape {

  constructor(
    pos = new Point(),
    protected _radius: number
  ) {
    super();

    this.setPos(new Point(pos.x - this._radius, pos.y - this._radius));
  }

  radius() {
    return this._radius;
  }

  draw(state: State): void {
    state.ctx.beginPath();
    state.ctx.arc(this.vPos().x, this.vPos().y, this._radius, 0, 2 * Math.PI);
    state.ctx.stroke();
  }

  override isPointIn(point: Point): Shape | null {
    const direction = new Vector(Math.abs(point.x - this.vPos().x), Math.abs(point.y - this.vPos().y));

    return direction.length() <= this._radius ? this : null;
  }
}