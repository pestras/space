export class Point {

  constructor(readonly x = 0, readonly y = 0) {}
  
  clone() {
    return new Point(this.x, this.y);
  }
}