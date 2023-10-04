import { Point } from "../point";
import { Size } from "../size";
import { State } from "../state";
import { Shape, ShapeStyle } from "./shape";

export interface TextStyle extends ShapeStyle {
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  fontStrokeStyle?: string;
  fontLineWidth?: number;
  fontLineJoin?: CanvasLineJoin;
  fontLineCap?: CanvasLineCap;
  opacity?: number;
}

export class Text extends Shape {
  private parts: string[] = [];
  private lineHeight = 16;
  private textWidth = 0;

  readonly style: TextStyle = {
    visible: true
  };

  constructor(pos = new Point(), protected _size: Size, protected _text: string) {
    super();

    this.setPos(pos);
  }

  height() {
    return this._size.h === -1 ? this.parts.length * this.lineHeight : this._size.h;
  }

  width() {
    return this._size.w === -1 ? 0 : this._size.w;
  }

  text(): string;
  text(value: string): void
  text(value?: string) {
    if (value !== undefined)
      this._text = value;
    else
      return this._text;
  }

  setStyle(style: TextStyle) {
    Object.assign(this.style, style);

    return this;
  }

  override isPointIn(point: Point): Shape | null {
    return point.x > this.vPos().x
      && point.x < (this.vPos().x + this.width())
      && point.y > this.vPos().y
      && point.y < (this.vPos().y + this.height())
      ? this : null;
  }

  private measure(ctx: CanvasRenderingContext2D, fontSize: number) {
    this.parts = [];

    if (this._text)

      if (this._size.w === -1)
        this.parts = [this._text];
      else {
        this.textWidth = ctx.measureText(this._text).width * fontSize / 10;
        if (this.textWidth > this._size.w) {
          this.splitText(ctx, fontSize);
        } else {
          this.parts = [this._text];
        }
      }
  }

  private splitText(ctx: CanvasRenderingContext2D, fontSize: number) {
    const words = this._text.split(" ");

    let part = "";

    while (words.length) {
      const newWord = words.shift() as string;
      let nextPart = (part + " " + newWord).trim();

      if ((ctx.measureText(nextPart).width * fontSize / 10) > this._size.w) {
        this.parts.push(part);
        part = newWord;
      } else {
        part = nextPart;

        if (words.length === 0)
          this.parts.push(part);
      }
      
      if (this._size.h > 0 && (this.lineHeight * (this.parts.length + 1) > this._size.h))
        break;
    }
  }

  draw(state: State): void {
    const fontSize = this.style.fontSize ?? state.style.fontSize
    this.lineHeight = fontSize;

    this.measure(state.ctx, fontSize);

    state.ctx.globalAlpha = this.style.opacity ?? state.style.opacity;
    state.ctx.font = `${fontSize}px ${this.style.fontFamily ?? state.style.fontFamily}`;
    state.ctx.textBaseline = 'top';

    if (this.style.fontColor !== 'none') {
      state.ctx.fillStyle = this.style.fontColor ?? state.style.fontColor;

      for (let i = 0; i < this.parts.length; i++)
        state.ctx.fillText(this.parts[i], this.vPos().x, this.vPos().y + (i * this.lineHeight));
    }

    if (this.style.fontLineWidth && this.style.fontStrokeStyle) {
      state.ctx.strokeStyle = this.style.fontStrokeStyle;
      state.ctx.lineWidth = this.style.fontLineWidth;
      state.ctx.lineJoin = this.style.fontLineJoin ?? state.style.fontLineJoin;
      state.ctx.lineCap = this.style.fontLineCap ?? state.style.fontLineCap;

      for (let i = 0; i < this.parts.length; i++)
        state.ctx.strokeText(this.parts[i], this.vPos().x, this.vPos().y + (i * this.lineHeight));
    }
  }
}