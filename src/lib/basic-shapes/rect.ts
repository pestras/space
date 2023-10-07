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

  constructor(pos = new Point(), protected _size = new Size(100, 60), protected _radius: number[] = [0]) {
    super();

    this.setPos(pos);
  }

  // style
  // -----------------------------------------------------------------------------------------------------
  protected readonly _style: RectStyle = {
    visible: true,
  };

  style(): RectStyle
  style(options: RectStyle): void
  style(options?: RectStyle) {
    if (options)
      Object.assign(this._style, options);
    else
      return Object.assign({}, this._style);
  }

  size(): Size
  size(value: Size): void
  size(value?: Size) {
    if (value)
      this._size = value;
    else
      return this._size;
  }

  radius(): number[];
  radius(value: number[]): void;
  radius(value?: number[]) {
    if (value)
      this._radius = value;
    else
      return [...this._radius];
  }

  override isPointIn(point: Point): Shape | null {
    return point.x > this.vPos().x
      && point.x < (this.vPos().x + this._size.w)
      && point.y > this.vPos().y
      && point.y < (this.vPos().y + this._size.h)
      ? this : null;
  }

  override draw(state: State) {
    state.ctx.globalAlpha = this._style.opacity ?? state.style.opacity;
    state.ctx.beginPath();

    state.ctx.roundRect(this.vPos().x, this.vPos().y, this._size.w, this._size.h, [16]);

    if (this._style.fill !== 'none') {
      state.ctx.fillStyle = this._style.fill ?? state.style.fill;
      state.ctx.fill();
    }

    if (this._style.lineWidth !== 0 && this._style.strokeStyle !== "none") {
      state.ctx.strokeStyle = this._style.strokeStyle ?? state.style.strokeStyle;
      state.ctx.lineWidth = this._style.lineWidth ?? state.style.lineWidth;
      state.ctx.lineJoin = this._style.lineJoin ?? state.style.lineJoin;
      state.ctx.lineCap = this._style.lineCap ?? state.style.lineCap;
      state.ctx.stroke();
    }

  }
}