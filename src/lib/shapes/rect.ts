import { Point } from "../point";
import { Shape } from "./shape";
import { Size } from "../size";
import { State } from "../state";
import { features } from "./features";

export class Rect extends Shape {
  private _draggable = false;
  private _arrowControl = false;

  constructor(pos = new Point(), protected _size = new Size(100, 60)) {
    super();

    this.setPos(pos);
  }

  size() {
    return this._size;
  }

  override isPointIn(point: Point): Shape | null {
    const child = super.isPointIn(point);

    if (child)
      return child;

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

  // dragging
  // ----------------------------------------------------------------------------------
  get draggable() {
    return this._draggable;
  }

  set draggable(value: boolean) {
    if (value === this._draggable)
      return;

    this._draggable = value;
    this._draggable ? features.drag.enable(this) : features.drag.disable(this);
  }

  // arrow control
  // ----------------------------------------------------------------------------------
  get arrowControl() {
    return this._arrowControl;
  }

  set arrowControl(value: boolean) {
    if (value === this._arrowControl)
      return;

    this._arrowControl = value;
    this._arrowControl ? features.arrowControl.enable(this) : features.arrowControl.disable(this);
  }
}