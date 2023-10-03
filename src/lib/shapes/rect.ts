import { Point } from "../point";
import { Shape } from "./shape";
import { Size } from "../size";
import { State } from "../state";

export class Rect extends Shape {

  constructor(pos = new Point(), protected _size = new Size(100, 60)) {
    super();

    this.setPos(new Point(pos.x + this._size.w / 2, pos.y + this._size.h / 2));
  }

  size() {
    return this._size;
  }

  override isPointIn(point: Point): Shape | null {
    return point.x > this.vPos().x
      && point.x < (this.vPos().x + this._size.w)
      && point.y > this.vPos().y
      && point.y < (this.vPos().y + this._size.h)
      ? this : null;
  }

  override draw(state: State) {
    state.ctx.fillStyle = this.style.fill ?? state.style.fill;
    state.ctx.beginPath();

    state.ctx.fillRect(this.vPos().x, this.vPos().y, this._size.w, this._size.h);

    if (state.selected === this) {
      state.ctx.lineWidth = 6;
      state.ctx.lineJoin = 'round';
      state.ctx.lineCap = 'round';
      state.ctx.strokeStyle = '#336';
      state.ctx.strokeRect(this.vPos().x, this.vPos().y, this._size.w, this._size.h);
    }
  }
}