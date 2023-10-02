export class Size {

  constructor(readonly w: number, readonly h: number) {}

  clone() {
    return new Size(this.w, this.h);
  }
}