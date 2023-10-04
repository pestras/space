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

  style: CircleStyle = { 
    visible: true
  };

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

  setStyle(style: Partial<CircleStyle>) {
    Object.assign(this.style, style);

    return this;
  }

  draw(state: State): void {
    state.ctx.beginPath();

    state.ctx.globalAlpha = this.style.opacity ?? state.style.opacity;
    state.ctx.arc(this.vPos().x, this.vPos().y, this._radius, 0, 2 * Math.PI);

    if (this.style.fill !== 'none') {
      state.ctx.fillStyle = this.style.fill ?? state.style.fill;
      state.ctx.fill();
    }

    if (this.style.lineWidth !== 0 && this.style.strokeStyle !== 'none') {
      state.ctx.strokeStyle = this.style.strokeStyle ?? state.style.strokeStyle;
      state.ctx.lineWidth = this.style.lineWidth ?? state.style.lineWidth;
      state.ctx.stroke();
    }
  }

  override isPointIn(point: Point): Shape | null {
    const direction = new Vector(Math.abs(point.x - this.vPos().x), Math.abs(point.y - this.vPos().y));

    return direction.length() <= this._radius ? this : null;
  }
}