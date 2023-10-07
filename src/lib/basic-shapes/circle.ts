import { Point } from "../point";
import { State } from "../state";
import { Vector } from "../vector";
import { Shape, ShapeStyle } from "./shape";

export interface CircleStyle extends ShapeStyle {
  fill?: string;
  strokeStyle?: string;
  lineWidth?: number;
  opacity?: number;
}

export class Circle extends Shape {

  constructor(
    pos = new Point(),
    protected _radius: number
  ) {
    super();

    this.setPos(new Point(pos.x - this._radius, pos.y - this._radius));
  }

  // style
  // --------------------------------------------------------------------------
  protected readonly _style: CircleStyle = { 
    visible: true
  };

  style(): CircleStyle
  style(options: CircleStyle): void
  style(options?: CircleStyle) {
    if (options)
      Object.assign(this._style, options);
    else
      return Object.assign({}, this._style);
  }

  radius() {
    return this._radius;
  }

  draw(state: State): void {
    state.ctx.beginPath();

    state.ctx.globalAlpha = this._style.opacity ?? state.style.opacity;
    state.ctx.arc(this.vPos().x, this.vPos().y, this._radius, 0, 2 * Math.PI);

    if (this._style.fill !== 'none') {
      state.ctx.fillStyle = this._style.fill ?? state.style.fill;
      state.ctx.fill();
    }

    if (this._style.lineWidth !== 0 && this._style.strokeStyle !== 'none') {
      state.ctx.strokeStyle = this._style.strokeStyle ?? state.style.strokeStyle;
      state.ctx.lineWidth = this._style.lineWidth ?? state.style.lineWidth;
      state.ctx.stroke();
    }
  }

  override isPointIn(point: Point): Shape | null {
    const direction = new Vector(Math.abs(point.x - this.vPos().x), Math.abs(point.y - this.vPos().y));

    return direction.length() <= this._radius ? this : null;
  }
}