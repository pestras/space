import { Point } from "../point";
import { Shape, ShapeStyle } from "./shape";
import { Size } from "../size";
import { State } from "../state";

export interface RectStyle extends ShapeStyle {
  fill?: string;
  strokeStyle?: string;
  lineWidth?: number;
  lineJoin?: CanvasLineJoin;
  lineCap?: CanvasLineCap;
  opacity?: number;
}

export class Rect extends Shape {

  readonly style: RectStyle = { 
    visible: true,
  };

  constructor(pos = new Point(), protected _size = new Size(100, 60)) {
    super();

    this.setPos(pos);
  }

  size() {
    return this._size;
  }

  setStyle(style: RectStyle) {
    Object.assign(this.style, style);

    return this;
  }

  override isPointIn(point: Point): Shape | null {
    return point.x > this.vPos().x
      && point.x < (this.vPos().x + this._size.w)
      && point.y > this.vPos().y
      && point.y < (this.vPos().y + this._size.h)
      ? this : null;
  }

  override draw(state: State) {
    state.ctx.globalAlpha = this.style.opacity ?? state.style.opacity;

    if (this.style.fill !== 'none') {
      state.ctx.fillStyle = this.style.fill ?? state.style.fill;
      state.ctx.beginPath();
    }

    state.ctx.fillRect(this.vPos().x, this.vPos().y, this._size.w, this._size.h);

    if (this.style.lineWidth !== 0 && this.style.strokeStyle !== "none") {
      state.ctx.strokeStyle = this.style.strokeStyle ?? state.style.strokeStyle;
      state.ctx.lineWidth = this.style.lineWidth ?? state.style.lineWidth;
      state.ctx.lineJoin = this.style.lineJoin ?? state.style.lineJoin;
      state.ctx.lineCap = this.style.lineCap ?? state.style.lineCap;
      state.ctx.strokeRect(this.vPos().x, this.vPos().y, this._size.w, this._size.h);
    }
  }
}